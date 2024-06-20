import { Schema, model } from "mongoose";
import {TAcademicSemester} from "./academicSemesterInterface";
import { AcademicSemesterCode, AcademicSemesterName, months } from "./academicSemester.constant";
import AppError from "../../errors/AppErrors";




const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            required: true,
            enum: AcademicSemesterName,
        },
        year: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            enum: AcademicSemesterCode,
        },
        startMonth: {
            type: String,
            required: true,
            enum: months,
        },
        endMonth: {
            type: String,
            required: true,
            enum: months,
        },
    } ,
    {
        timestamps: true,
    },
);


academicSemesterSchema.pre('save',async function(next){
    const isSemesterExists = await AcademicSemesterModel.findOne({
        name:this.name,
        year:this.year
    })

    if(isSemesterExists){
        throw new AppError(404,'Semester is already exist !')
    }
    next()
})


 

export const AcademicSemesterModel =
    model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)