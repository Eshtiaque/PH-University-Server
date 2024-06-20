import AppError from '../../errors/AppErrors';
import { AcademicSemesterCode, academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from "./academicSemesterInterface";
import { AcademicSemesterModel } from './academicSemesterModel';



const createAcademicSemesterIntoDB =async(payload:TAcademicSemester)=>{
   
    //semester  name---> semester code relation
     if(academicSemesterNameCodeMapper[payload.name]!==payload.code){
        throw new AppError (404,"Invalid Semester Code")
    }

   const result = await AcademicSemesterModel.create(payload);
   return result;
};


const getAllAcademicSemesterFromDB = async()=>{
    const result = await AcademicSemesterModel.find()
    return result;
}

const getSingleAcademicSemesterFromDB = async(id:string)=>{
 const result = await AcademicSemesterModel.findById(id);
 return result;
}


const updateAcademicSemesterDB= async(id:string, payload:Partial<TAcademicSemester>)=>{
        if(
            payload.name &&
            payload.code &&
            academicSemesterNameCodeMapper[payload.name]!==payload.code
        ){
            throw new AppError(404,'Invalid Semester Code');

        }

    const result = await AcademicSemesterModel.findByIdAndUpdate({_id:id}, payload, {
        new:true
    })
    return result
  }


export const AcademicSemesterService ={
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterDB
}