import { TAcademicFaculty } from "./AcademicFaculty.interface";
import { AcademicFacultyModel } from "./AcademicFaculty.model";


const createAcademicFacultyIntoDB =async(payload:TAcademicFaculty)=>{
   
   
   const result = await AcademicFacultyModel.create(payload);
   return result;
};


const getAllAcademicFacultiesFromDB = async()=>{
    const result = await AcademicFacultyModel.find()
    return result;
}

const getSingleAcademicFacultyFromDB = async(id:string)=>{
 const result = await AcademicFacultyModel.findById(id);
 return result;
}


const updateAcademicFacultyDB= async(id:string, payload:Partial<TAcademicFaculty>)=>{
      
    const result = await AcademicFacultyModel.findByIdAndUpdate({_id:id}, payload, {
        new:true
    })
    return result
  }


export const AcademicFacultyService ={
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyDB
    
}