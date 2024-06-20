import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { SemesterRegistration } from './../semesterRegistration/semesterRegistration.model';

import { TOfferedCourse } from "./OfferedCourse.interface";
import { OfferedCourse } from "./OfferedCourse.model";
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/AcademicFaculty.model';
import { Course } from '../Course/Course.model';
import { Faculty } from '../Faculty/faculty.model';
import { hasTimeConflict } from './OfferedCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';




const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    //if the semester registration id is exist!
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;
    ////
    const isSemesterRegistrationExist = await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration Not found')
    }
    ////
    const isAcademicFacultyExist = await AcademicFacultyModel.findById(academicFaculty);

    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty Not found')
    }
    ////
    const isAcademicDepartmentExist = await AcademicDepartmentModel.findById(academicDepartment);

    if (!isAcademicDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not found')
    }
    ////  
    const isCourseExist = await Course.findById(course);

    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department Not found')
    }
    ////
    const isFacultyExits = await Faculty.findById(faculty);

    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }
    ////
    const academicSemester = isSemesterRegistrationExist.academicSemester


    //check if the department  is belong to that faculty
    const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
        _id: academicDepartment,
        academicFaculty,

    });

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `This ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`);
    }

    //check it the same offered course same section in same registered semester exists

    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, `Offered course with same section is already exist ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`);
    }

    //time conflict for faculty and get the schedule for  faculty
    const assignSchedule = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignSchedule, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }

    const result = await OfferedCourse.create({
        ...payload,
        academicSemester
    });
    return result;
}

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {

    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
    }

    const isFacultyExists = await Faculty.findById(faculty);

    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;


    // Checking the status of the semester registration
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }



    // check if the faculty is available at that time.
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }




    const result = await OfferedCourse.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
        }
    );
    return result;




}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await offeredCourseQuery.modelQuery;
    return result;
    
};

const getSingleOfferedCourseFromDB = async (id: string) => {
    const offeredCourse = await OfferedCourse.findById(id);
  
    if (!offeredCourse) {
      throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
    }
  
    return offeredCourse;
  };

const deleteOfferedCourseFromDB = async (id: string) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = await OfferedCourse.findById(id);
  
    if (!isOfferedCourseExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
    }
  
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  
    const semesterRegistrationStatus =
      await SemesterRegistration.findById(semesterRegistration).select('status');
  
    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
      );
    }
  
    const result = await OfferedCourse.findByIdAndDelete(id);
  
    return result;
  };  



export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    deleteOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
};