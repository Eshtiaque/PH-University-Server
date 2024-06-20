import { error } from "console";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartmentModel } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB =async(payload:TAcademicDepartment)=>{
   
    //condition for not for second same department
    // const isDepartmentExist = await AcademicDepartmentModel.findOne({
    //     name:payload.name
    // })
    // if(isDepartmentExist){
    //     throw new AppError (404,'This department is already exist')
    // }

   
   const result = await AcademicDepartmentModel.create(payload);
   return result;
};


const getAllAcademicFacultiesFromDB = async()=>{
    const result = await AcademicDepartmentModel.find().populate('academicFaculty')
    return result;
}

const getSingleAcademicDepartmentFromDB = async(id:string)=>{
 const result = await AcademicDepartmentModel.findById(id).populate('academicFaculty');
 return result;
}


const updateAcademicDepartmentDB= async(id:string, payload:Partial<TAcademicDepartment>)=>{
      
    const result = await AcademicDepartmentModel.findByIdAndUpdate({_id:id}, payload, {
        new:true
    })
    return result
  }


export const AcademicDepartmentService ={
    createAcademicDepartmentIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentDB
    
}