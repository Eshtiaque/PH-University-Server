import { query } from "express"
import QueryBuilder from "../../builder/QueryBuilder"
import { AdminSearchableFields } from "./admin.constant"
import { Admin } from "./admin.model"
import { TAdmin } from "./admin.interface"
import mongoose from "mongoose"
import { start } from "repl"
import AppError from "../../errors/AppErrors"
import httpStatus from "http-status"
import { User } from "../user/user.model"




const getAllAdminFromDB = async (query: Record<string, unknown>) => {
    const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await adminQuery.modelQuery;
    return result;

}


const getSingleAdminFromDB = async (id: string) => {
    const result = await Admin.findById(id)
    return result;
}

const updateAdminDB = async (id: string, payload: Partial<TAdmin>) => {
    const { name, ...remainingAdminData } = payload;
    const modificationData: Record<string, unknown> = {
        ...remainingAdminData,
    };
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modificationData[`name.${key}`] = value;
        }
      }


      console.log("Updating Admin with ID:", id); // Log the ID
  console.log("Modification Data:", modificationData);

      const result = await Admin.findByIdAndUpdate(
        id,
        modificationData,
        {new:true, 
            runValidators:true});

      return result;
}


const deleteAdminFromDB = async(id:string)=>{
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        const deleteAdmin = await Admin.findByIdAndUpdate(
            id,
            {isDeleted:true},
            {new:true, session},
        );

        if(!deleteAdmin){
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin')
        }

        const userId= deleteAdmin.user;

        const deleteUser = await User.findByIdAndUpdate(
            userId,
            {isDeleted:true},
            {new:true, session}
        )

        if(!deleteUser){
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User')
        }

        await session.commitTransaction();
        await session.endSession();

        return deleteUser;
    }catch(err:any){
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
}

export const AdminService = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminDB,
    deleteAdminFromDB
}