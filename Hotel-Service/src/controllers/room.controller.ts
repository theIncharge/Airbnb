import { NextFunction, Request, Response } from "express";
import { getAvailableRoomsService, updateBookingIdToRoomService } from "../services/room.service";
import { StatusCodes } from "http-status-codes";

export async function getAvailableRoomsHandler(req:Request,res:Response,next:NextFunction){
   
    const rooms=await getAvailableRoomsService({
        roomCategoryId:Number(req.query.roomCategoryId),
        checkInDate:req.query.checkInDate as string,
        checkOutDate:req.query.checkOutDate as string
    })
    res.status(StatusCodes.OK).json({
        message:"Rooms found successfully",
        data: rooms,
        success:true
    })
}
export async function updateBookingIdToRoomsHandler(req:Request,res:Response,next:NextFunction){
    const response=await updateBookingIdToRoomService(req.body)
    res.status(StatusCodes.OK).json({
        message:"Booking Id updated to rooms successfully",
        data: response,
        success:true
    })
}