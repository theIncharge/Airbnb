import { getAvailableRooms, updateBookingIdToRooms } from "../api/hotel.api"
import { serverConfig } from "../config"
import { redlock } from "../config/redis.config"
import { CreateBookingDto } from "../dto/booking.dto"
import { prisma } from "../prisma/client"
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from "../repositories/Booking.repository"
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error"
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey"

type AvailableRoom={
    id:number,
    roomCategoryId:number,
    dateOfAvailability:Date
}

export async function createBookingService(createBookingData:CreateBookingDto 
){ 
    const ttl=serverConfig.LOCK_TTL
    const bookingResource=`hotel:${createBookingData.hotelId}`
    const availableRooms=await getAvailableRooms(
        createBookingData.roomCategoryId,
        createBookingData.checkInDate,
        createBookingData.checkOutDate
    )

       const checkOutDate=new Date(createBookingData.checkOutDate)
    const checkInDate=new Date(createBookingData.checkInDate)
    
    const totalNights=(checkOutDate.getTime()-checkInDate.getTime())/(1000*60*60*24)
     if(availableRooms.length==0 || availableRooms.length<totalNights){
        throw new BadRequestError("No rooms available")
    }


    let lock;
     try{
    lock=await redlock.acquire([bookingResource],ttl)
        console.log(`requiring lock for the resource: ${bookingResource} with TTL: ${ttl}, lock:${lock}`)
        const booking=await createBooking({
        userId:createBookingData.userId,
        hotelId:createBookingData.hotelId,
        bookingAmount:createBookingData.bookingAmount,
        totalGuests:createBookingData.totalGuests,
        // status:"PENDING"
        checkInDate:new Date(createBookingData.checkInDate),
        checkOutDate:new Date(createBookingData.checkOutDate),
        roomCategoryId:createBookingData.roomCategoryId
})

    const idempotencyKey=generateIdempotencyKey()
    await createIdempotencyKey(idempotencyKey,booking.id)

    await updateBookingIdToRooms(booking.id,availableRooms.data.map((room:AvailableRoom)=>room.id))

    return {
        bookingId: booking.id,
        idempotencyKey:idempotencyKey
    }
    
     }catch(error){
        throw new InternalServerError("Can not lock the resource")
     }
    
   
}

export async function confirmBookingService(idempotencnyKey:string){
    
    return await prisma.$transaction(async (tx)=>{
        const idempotencyKeyData=await getIdempotencyKey(tx,idempotencnyKey)

     if(!idempotencyKeyData || !idempotencyKeyData.bookingId){
        throw  new NotFoundError("Idempotency Key Not Found")


     }

     if(idempotencyKeyData.finalized){
        throw new BadRequestError("Idem;otency Key Already Finalized")
     }

     const booking=await confirmBooking(tx,idempotencyKeyData.bookingId)
     await finalizeIdempotencyKey(tx,idempotencyKeyData.idemKey)
     return booking

    })

    
}