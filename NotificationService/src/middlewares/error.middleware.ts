import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/app.error";

export const genericErrrorHandler=(err:AppError,req:Request,res:Response,next:NextFunction)=>{
    console.log("==================================================================================")
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}