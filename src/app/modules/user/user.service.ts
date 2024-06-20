import config from "../../config";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { StudentModel } from '../student/student.model';
import { Student } from "../student/student.interface";
import { TAcademicSemester } from "../academicSemester/academicSemesterInterface";
import { AcademicSemesterModel } from "../academicSemester/academicSemesterModel";
import { generateFacultyId, generateStudentId, generatedAdminId } from "./user.utils";
import mongoose from "mongoose";
import AppError from "../../errors/AppErrors";
import httpStatus from "http-status";
import { TFaculty } from "../Faculty/faculty.interface";
import { Faculty } from '../Faculty/faculty.model';
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { TAdmin } from "../Admin/admin.interface";
import { Admin } from "../Admin/admin.model";

const createStudentIntoDB =
    async (password: string, payload: Student) => {

        //set student role

        const userData: Partial<TUser> = {};

        //if password is not given , use default password
        userData.password = password || (config.default_pass as string);

        //set user role
        userData.role = 'student';




        //find academic semester info
        const admissionSemester = await AcademicSemesterModel.findById(payload.admissionSemester);


        const session = await mongoose.startSession()


        try {
            //start transaction
            session.startTransaction()

            userData.id = await
                generateStudentId(admissionSemester as TAcademicSemester);


            //create a user (transaction -1)
            const newUser = await User.create([userData], { session }); //now this is array

            //create a student
            if (!newUser.length) {
                throw new AppError(
                    httpStatus.BAD_REQUEST, "Failed to create user")
            }
            payload.id = newUser[0].id;
            payload.user = newUser[0]._id; //reference


            //create a user (transaction -2)
            const newStudent =
                await StudentModel.create([payload], { session });


            if (!newStudent.length) {
                throw new AppError(
                    httpStatus.BAD_REQUEST, "Failed to create student")
            }

            //commit transaction
            await session.commitTransaction()
            await session.endSession();

            return newStudent;

        }
        catch (err) {

            await session.abortTransaction()
            await session.endSession()
            //throw new Error(err);
           

        }



    };

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
        // create a user object
        const userData: Partial<TUser> = {};
      
        //if password is not given , use default password
        userData.password = password || (config.default_pass as string);
      
        //set student role
        userData.role = 'faculty';
      
        // find academic department info
        const academicDepartment = await AcademicDepartmentModel.findById(
          payload.academicDepartment,
        );
      
        if (!academicDepartment) {
          throw new AppError(400, 'Academic department not found');
        }
      
        const session = await mongoose.startSession();
      
        try {
          session.startTransaction();
          //set  generated id
          userData.id = await generateFacultyId();
      
          // create a user (transaction-1)
          const newUser = await User.create([userData], { session }); // array
      
          //create a faculty
          if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
          }
          // set id , _id as user
          payload.id = newUser[0].id;
          payload.user = newUser[0]._id; //reference _id
      
          // create a faculty (transaction-2)
      
          const newFaculty = await Faculty.create([payload], { session });
      
          if (!newFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
          }
      
          await session.commitTransaction();
          await session.endSession();
      
          return newFaculty;
        } catch (err) {
          await session.abortTransaction();
          await session.endSession();
          //throw new Error(err);
        }
      };

const createAdminIntoDB = async(password:string, payload:TAdmin)=>{
  //create user object 
  const userData : Partial<TUser>={}

  //if password is not given the auto set password
  userData.password= password || config.default_pass as string;

  //set student role
  userData.role= 'admin';
  
  const session = await mongoose.startSession();
  try{
    session.startTransaction();

    //set generated id
    userData.id= await generatedAdminId();

    //create a new user 
    const newUser = await User.create([userData],{session});

     //create a admin
    if(!newUser){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to create New User')
    }

    //set id, _id as user

    payload.id= newUser[0].id;
    payload.user= newUser[0]._id;

    //create Admin
    const newAdmin = await Admin.create([payload],{session});

    if(!newAdmin){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create Admin')
    }
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;

  }catch(err ){
    await session.abortTransaction();
    await session.endSession();
   // throw new Error(err);

  }
}      
      

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB
}