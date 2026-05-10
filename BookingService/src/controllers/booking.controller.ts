import { NextFunction, Request, Response } from "express";
import { confirmBookingService, createBookingService } from "../services/booking.service";

export  const  boookingHandler=async (req:Request,res:Response,next:NextFunction)=>{
    const booking= await createBookingService(req.body)
     res.status(201).send({
        bookingId:booking.bookingId,
        idempotencyKey:booking.idempotencyKey
     })
}

export const confirmBooking=async (req:Request,res:Response,next:NextFunction)=>{
    console.log("+++++++++++++++++++++++++++++++++++++++++=")
    const booking =await confirmBookingService(req.params.idempotencyKey)

    res.status(200).json({
        bookingId:booking.id,
        status:booking.status,
    })
}