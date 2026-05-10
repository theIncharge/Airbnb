import { serverConfig } from "../config"
import { redlock } from "../config/redis.config"
import { createBookingDto } from "../dto/booking.dto"
import { prisma } from "../prisma/client"
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from "../repositories/Booking.repository"
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error"
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey"



export async function createBookingService(createBookingData:createBookingDto 
){ 
    const ttl=serverConfig.LOCK_TTL
    const bookingResource=`hotel:${createBookingData.hotelId}`

    let lock;
     try{
    lock=await redlock.acquire([bookingResource],ttl)
        console.log(`requiring lock for the resource: ${bookingResource} with TTL: ${ttl}, lock:${lock}`)
        const booking=await createBooking({
        userId:createBookingData.userId,
        hotelId:createBookingData.hotelId,
        bookingAmount:createBookingData.bookingAmount,
        totalGuests:createBookingData.totalGuests,
        status:"PENDING"
})

    const idempotencyKey=generateIdempotencyKey()
    await createIdempotencyKey(idempotencyKey,booking.id)

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