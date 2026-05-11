import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import logger from "../config/logger.config";

export const validateRequestBody=(schema: ZodSchema)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            logger.info("Validating Request Body")
           await schema.parseAsync(req.body)
           logger.info("Request Body is fine  ")
           
           next()
        }catch(err){
            res.status(400).json({
                message:"Invalid request Body",
                success:false,
                error:err
            })
        }
    }
}

