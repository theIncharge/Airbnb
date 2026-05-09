import { NextFunction, Request, Response } from "express";
import { createHotelDto } from "../dto/hotel.dto";
import { createHotelService, deleteHotelService, getAllHotelsService, getHotelByIdService } from "../services/hotel.service";
import {  StatusCodes } from "http-status-codes";

export async function createHotelHandler(req:Request,res:Response,next:NextFunction){
    try {
        const hotelData:createHotelDto=req.body
        const hotelResponse= await createHotelService(hotelData)
        res.status(201).json({
            message:"Hotel Created Succesfully",
            data:hotelResponse,
            success:true
        })
    } catch (error) {
        next(error)
    }
}

export async function getHotelByIdHandler(req:Request,res:Response,next:NextFunction){
    const hotelResponse=await getHotelByIdService(Number(req.params.id))

    res.status(200).json({
        message:"Hotel Found Successfully",
        data: hotelResponse,
        success:true
    })
}

export async function getAllHotelsHandler(req:Request,res:Response,next:NextFunction){
    const hotels=await getAllHotelsService()
    res.status(StatusCodes.OK).json({
        message:"Hotels found successfully",
        data: hotels,
        success:true
    })

    
}


export async function deleteHotelHandler(req:Request,res:Response,next:NextFunction){
    const response=deleteHotelService(Number(req.params.id))

    res.status(StatusCodes.OK).json({
        message:"Hotel Deleted SuccessFully",
        data:response,
        success:true
    })
}