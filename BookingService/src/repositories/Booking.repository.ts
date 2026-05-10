import { prisma } from "../prisma/client"
import { Prisma } from "../prisma/generated/prisma/client"
import { BookingStatus } from "../prisma/generated/prisma/enums"
import { BookingCreateInput } from "../prisma/generated/prisma/models"





export async function createBooking(bookingInput:BookingCreateInput){
    const booking =await prisma.booking.create({
        data: bookingInput
    })
    return booking
}


export async function createIdempotencyKey(key:string,bookingId?:number){

    const idempotencyKey=await prisma.idempotencyKey.create({
        data:{
            key,
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
    const idempotencyKey=await tx.$queryRaw`
    SELECT * FROM "IdempotentKey" WHERE key=$1 FOR UPDATE,key 
    `
    return idempotencyKey
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


export async function confirmBooking(bookingId:number){
    const booking=await prisma.booking.update({
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

export async function finalizeIdempotencyKey(key:string){
    const idmepotencyKey=await prisma.idempotencyKey.update({
        where:{
            key:key
        },
        data:{
            finalized: true
        }
    })
    return idmepotencyKey
}