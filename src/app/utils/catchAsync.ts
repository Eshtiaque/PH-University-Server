import { NextFunction, Request, RequestHandler, Response } from "express";


//reason for not to use try catch
const catchAsync = (fn:RequestHandler) =>{
    return (req:Request, res:Response, next:NextFunction)=>{
      Promise.resolve(fn(req, res, next)).catch((err)=>next(err));
    }
    }
    

 export default catchAsync   