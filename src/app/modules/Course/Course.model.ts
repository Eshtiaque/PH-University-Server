import {  Schema, model,  } from "mongoose";
import { TCourse, TCourseFaculty, TPreRequisiteCourse } from "./Course.interface";

const PreRequisiteCourseSchema = new Schema<TPreRequisiteCourse>({
    course:{
        type: Schema.Types.ObjectId,
        ref:'Course'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        required: [true, ' Title is Required'],
        unique: true,
        trim: true
    },
    prefix: {
        type: String,
        required: [true, ' Prefix is Required'],
        trim: true
    },
    code: {
        type: Number,
        required: true,
    },
    credits: {
        type: Number,
        trim: true,
        required: true
    },
    preRequisiteCourses:[PreRequisiteCourseSchema],
    isDeleted:{
        type:Boolean,
        default:false
    }
})


export const Course = model<TCourse>('Course', courseSchema)


const courseFacultySchema = new Schema<TCourseFaculty>({
    course:{
        type: Schema.Types.ObjectId,
        ref:'Course',
        unique:true
    },
    faculties: [{
        type: Schema.Types.ObjectId,
        ref:'Faculty',
        unique:true
    }]
})


export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema)

