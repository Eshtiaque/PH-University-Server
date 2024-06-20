import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { extend, number } from "joi";
import { publicDecrypt } from "crypto";
import AppError from "../../errors/AppErrors";
import httpStatus from "http-status";




const AcademicDepartmentSchema = new Schema<TAcademicDepartment>({
    name:{
        type:String,
        required : true,
        unique: true,
    },
    academicFaculty:{
        type:Schema.Types.ObjectId,
        ref:'AcademicFaculty'
    }
    
},{
    timestamps:true
})



//service layer
//static
//pre middleware
//instance method

//there will be not any duplicate data
AcademicDepartmentSchema.pre('save', async function(next){
    const isDepartmentExist = await AcademicDepartmentModel.findOne({
        name:this.name
    })
    if(isDepartmentExist){
        throw new AppError (
            httpStatus.NOT_FOUND,
            'This department is already exist')
    }
    next()
})






////there will be not any update for deleted data

AcademicDepartmentSchema.pre('findOneAndUpdate', async function(next){
    const query = this.getQuery()
    const isDepartmentExist = await AcademicDepartmentModel.findOne(query)

    if(!isDepartmentExist){
        throw new AppError ( 
            httpStatus.NOT_FOUND,
            'This department is dose not exist')
    }

    next()
})

  


export const AcademicDepartmentModel =  model<TAcademicDepartment>('AcademicDepartment' , AcademicDepartmentSchema)

