import { Faculty } from './../Faculty/faculty.model';
import { Types } from "mongoose";

export type TPreRequisiteCourse ={
    course:Types.ObjectId;
    isDeleted:Boolean;
}


export type TCourse ={
    title:string;
    prefix:string;
    code:number;
    credits:number;
    isDeleted?:Boolean;
    preRequisiteCourses:[TPreRequisiteCourse]
}

export type TCourseFaculty={
    course:Types.ObjectId,
    faculties:[Types.ObjectId]
}