import { NextFunction, Request, Response } from "express";

import { asyncLocalStorage } from "../utils/helpers/request.helper";
import { v4 as uuidv4 } from "uuid";


export const attachCorrelationMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const correlationId=uuidv4()
            asyncLocalStorage.run({correlationId:correlationId},()=>{
                next()
            })
        
}