/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import { AcademicSemesterModel } from "../academicSemester/academicSemesterModel";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";
import mongoose from "mongoose";
import { OfferedCourse } from "../offeredCourse/OfferedCourse.model";


const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration,
) => {
    //check if the semester is exist 
    const academicSemester = payload?.academicSemester

    //check if there any registered semester that is already "upcoming" or "ongoing"
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [
            { status: RegistrationStatus.UPCOMING },
            { status: RegistrationStatus.ONGOING }
        ]
    })

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `There is already a ${isThereAnyUpcomingOrOngoingSemester.status} semester`);
    }




    //check the registration is it already in my database or not?
    const isAcademicSemesterExists = await AcademicSemesterModel.findById(academicSemester);

    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This Academic Semester Not Found');
    }
    //check if the semester is already start
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester })

    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.CONFLICT, 'This Semester as already  Registered');
    }

    const result = await SemesterRegistration.create(payload);
    return result;
}

const getAllSemesterRegistrationsFromDB = async (
    query: Record<string, unknown>,
) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await semesterRegistrationQuery.modelQuery;
    return result;

}


const getSingleSemesterRegistrationsFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);
    return result;
};


const updateSemesterRegistrationIntoDB = async (
    id: string,
    payload: Partial<TSemesterRegistration>,
) => {
    //if the requested semester is exists
    const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.BAD_REQUEST,
            `This semester is not found `);
    }



    //if the requested semester registration is ended,we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExist?.status;
    const requestedStatus = payload?.status;

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester is  ${currentSemesterStatus} `);
    }

    //UPCOMING -> ONGOING -> ENDED
    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not update directly status from ${currentSemesterStatus} to ${requestedStatus} `);
    }
    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not update directly status from ${currentSemesterStatus} to ${requestedStatus} `);
    }
    //UPCOMING -> ONGOING -> ENDED

    const result = await SemesterRegistration.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true
        }

    );
    return result;
}


const deleteSemesterRegistrationFromDB = async (id: string) => {
    /** 
 * Step1: Delete associated offered courses.
 * Step2: Delete semester registration when the status is 
 'UPCOMING'.
 **/

    // checking if the semester registration is exist
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This registered semester is not found !',
        );
    }

    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus =
        isSemesterRegistrationExists.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update as the registered semester is ${semesterRegistrationStatus}`,
        );
    }
    const session = await mongoose.startSession();

    //deleting associated offered courses


    try {
        session.startTransaction();
        const deletedOfferedCourse = await OfferedCourse.deleteMany(
            {
                semesterRegistration: id,
            },
            {
                session,
            },
        );
            if(!deletedOfferedCourse){
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Failed to delete semester registration !',
                  );
            }
            const deletedSemesterRegistration =
            await SemesterRegistration.findByIdAndDelete(id, {
              session,
              new: true,
            });
      
          if (!deletedSemesterRegistration) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              'Failed to delete semester registration !',
            );
          }
      
          await session.commitTransaction();
          await session.endSession();
      
          return null;


    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }


}

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
};