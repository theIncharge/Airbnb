import { prisma } from "../prisma/client"
import { IdempotencyKey, Prisma } from "../prisma/generated/prisma/client"
import { BookingStatus } from "../prisma/generated/prisma/enums"
import { BookingCreateInput } from "../prisma/generated/prisma/models"
import { validate as isValidUUID } from "uuid"
import { BadRequestError, NotFoundError } from "../utils/errors/app.error"





export async function createBooking(bookingInput:BookingCreateInput){
    const booking =await prisma.booking.create({
        data: bookingInput
    })
    return booking
}


export async function createIdempotencyKey(key:string,bookingId?:number){

    const idempotencyKey=await prisma.idempotencyKey.create({
        data:{
            idemKey:key,
            booking:{
                connect:{
                    id:bookingId
                }
            }
        }
    })

    return idempotencyKey 

}

export async function getIdempotencyKey(tx:Prisma.TransactionClient,key:string){
    if(!isValidUUID(key)){
        throw new BadRequestError("Invalid Idempotency key")
    }
    const idempotencyKey:Array<IdempotencyKey>=await tx.$queryRaw`
    SELECT * FROM IdempotencyKey WHERE idemKey=${key} FOR UPDATE;
    `
    if(!idempotencyKey || idempotencyKey.length===0){
        throw new NotFoundError("No idmepotency key found")
    }

    console.log("Idempotency key with lock: ",idempotencyKey)
    return idempotencyKey[0]
}


export async function getBookingById(bookingId:number){
    const booking=await prisma.booking.findUnique({
        where:{
            id:bookingId
        }
    })
    return booking
}

export async function finalizeBooking(bookingId: number){
    const booking=await prisma.booking.update({
        where:{
            id:bookingId
        },
        data:{
            status:BookingStatus.CONFIRMED
        }
 } )
    return booking
}


export async function confirmBooking(tx:Prisma.TransactionClient,bookingId:number){
    const booking=await tx.booking.update({
        where:{
            id:bookingId
        },
        data:{
            status:"CONFIRMED"
        }
    })
    return booking
}

export async function cancelBooking(bookingId:number){
    const booking=await prisma.booking.update({
        where:{
            id:bookingId
        },
        data:{
            status:BookingStatus.CANCELLED
        }
    })
    return booking
}

export async function finalizeIdempotencyKey(tx:Prisma.TransactionClient,key:string){
    const idmepotencyKey=await tx.idempotencyKey.update({
        where:{
            idemKey:key
        },
        data:{
            finalized: true
        }
    })
    return idmepotencyKey
}