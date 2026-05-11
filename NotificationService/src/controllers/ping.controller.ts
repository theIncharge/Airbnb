import { NextFunction, Request, Response } from "express"

import { InternalServerError } from "../utils/errors/app.error"
import logger from "../config/logger.config"
export const  pingHandler=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
       
        logger.info("Pong hit")
        res.status(200).json({message:"pong!"})
    }catch(err){
        console.log("We came here in error   ")
        
        throw new InternalServerError("Something went wrong boooooo")
    }
}