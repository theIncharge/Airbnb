import { createBookingDto } from "../dto/booking.dto"
import { prisma } from "../prisma/client"
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from "../repositories/Booking.repository"
import { BadRequestError, NotFoundError } from "../utils/errors/app.error"
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey"



export async function createBookingService(createBookingData:createBookingDto 
){
    console.log("Hello")
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
    
}

export async function confirmBookingService(idempotencnyKey:string){
    
    return await prisma.$transaction(async (tx)=>{
        const idempotencyKeyData=await getIdempotencyKey(tx,idempotencnyKey)

     if(!idempotencyKeyData){
        throw  new NotFoundError("Idempotency Key Not Found")


     }

     if(idempotencyKeyData.finalized){
        throw new BadRequestError("Idem;otency Key Already Finalized")
     }

     const booking=await confirmBooking(idempotencyKeyData.bookingId)
     await finalizeIdempotencyKey(idempotencyKeyData.key)
     return booking

    })

    
}