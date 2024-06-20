/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError,  } from "zod";
import { TErrorSources } from '../Interface/error';
import config from "../config";
import handleZodError from "../errors/handleZodError";
import handleVAlidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppErrors";


//global error handling
const globallyErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {


  //setting default values
  let statusCode = 500;
  let message = 'Something went Wrong';
  let errorSource: TErrorSources = [
    {
      path: '',
      message: 'Something went Wrong'
    }
  ]
  //ending setting default values





  if (err instanceof ZodError) {
    const simplifyError = handleZodError(err)
    statusCode = simplifyError?.statusCode,
      message = simplifyError?.message,
      errorSource = simplifyError?.errorSources
  }
  else if (err?.name === 'ValidationError') {
    const simplifyError = handleVAlidationError(err)
    statusCode = simplifyError?.statusCode,
      message = simplifyError?.message,
      errorSource = simplifyError?.errorSources
  }
  else if (err?.name === 'CastError') {
    const simplifyError = handleCastError(err)
    statusCode = simplifyError?.statusCode,
      message = simplifyError?.message,
      errorSource = simplifyError?.errorSources
  }
  else if (err?.code === '11000') {
    const simplifyError = handleDuplicateError(err)
    statusCode = simplifyError?.statusCode,
      message = simplifyError?.message,
      errorSource = simplifyError?.errorSources
  }
  else if (err instanceof AppError) {
    statusCode = err?.statusCode,
      message = err?.message,
      errorSource = [{
        path: '',
        message: err?.message
      }]
  }
  else if (err instanceof Error) {
    message = err?.message,
      errorSource = [{
        path: '',
        message: err?.message
      }]
  }




  //ultimate return 
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: config.node_env === 'development' ? err?.stack : null

  })
}

export default globallyErrorHandler


//pattern

/*
success:
message:
errorSources:[
  path:"",
  message:""
],
stack:



*/