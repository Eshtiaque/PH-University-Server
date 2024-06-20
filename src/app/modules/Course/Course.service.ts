import { CourseSearchableFields } from './Course.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCourse, TCourseFaculty } from './Course.interface';
import { Course, CourseFaculty } from "./Course.model"
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';


const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCourseIntoDB = async (query: Record<string, unknown>) => {

    const courseQuery = new QueryBuilder(Course.find(),
        //populate('preRequisiteCourses.course'
        query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await courseQuery.modelQuery;
    return result;
}

const getSingleCourseIntoDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate
        (
            id,
            { isDeleted: true },
            {
                new: true,
            }
        );

    if (!result) {
        throw new Error('Course not found or already deleted');
    }

    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {

    const { preRequisiteCourses, ...remainingData } = payload;


    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        //step-1:basic course info update
        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            remainingData,
            {
                new: true,
                runValidators: true,
                session
            }
        );

        if (!updatedBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
        }


        //if there is any pre requisite courses to update
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            //filter out the deleted fields
            const deletedPreRequisites = preRequisiteCourses.filter(el => el.course && el.isDeleted).map((el) => el.course)


            const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: { course: { $in: deletedPreRequisites } }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );


            if (!deletedPreRequisitesCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
            }

            //filter out the new course fields

            const newRequisite = preRequisiteCourses?.filter(el => el.course && !el.isDeleted)

            const newRequisiteCourses = await Course.findByIdAndUpdate
                (
                    id,
                    {
                        $addToSet: {
                            preRequisiteCourses: { $each: newRequisite }
                        }
                    },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }

                )

            if (!newRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
            }
        }


        await session.commitTransaction();
        await session.endSession();


        const result = await Course.findById(id).populate('preRequisiteCourses.course')

        return result;

    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
}

const assignFacultiesWithCourseIntoDB= async(id:string, payload:Partial<TCourseFaculty>)=>{
    
    const result = await CourseFaculty.findByIdAndUpdate
    (
        id,
        {
            course:id,
            $addToSet:{faculties:{$each:payload}}
        },{
            upsert:true,
            new:true
        }

    )

return result;

}


const removeFacultiesWithCourseFromDB= async(id:string, payload:Partial<TCourseFaculty>)=>{
    
    const result = await CourseFaculty.findByIdAndUpdate
    (
        id,
        {
            $pull:{faculties:{$in:payload}}
        },{
           
            new:true
        }

    )

return result;

}


export const CourseServices = {
    createCourseIntoDB,
    getAllCourseIntoDB,
    getSingleCourseIntoDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesWithCourseFromDB
}