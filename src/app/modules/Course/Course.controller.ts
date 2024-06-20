import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./Course.service";



const createCourse  = catchAsync(async (req, res) => {
  
      //const {password, student: studentData } = req.body;
      const result = await CourseServices.createCourseIntoDB(req.body,);


      sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message :'Course  is created successfully',
        data:result

      });

    
  });


  const getAllCourses = catchAsync(async(req, res)=>{
    const result =  await
    CourseServices.getAllCourseIntoDB(req.query);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'All Courses  are retrieved successfully',
      data:result

    });
    console.log(result);
  });


  const getSingleCourse = catchAsync(async(req, res)=>{
    const { id } = req.params;

    const result =  await
    CourseServices.getSingleCourseIntoDB(id);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Single Courses  is retrieved  by Id successfully',
      data:result

    });
    console.log(result);
  });


  const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(
      id,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty is updated successfully',
      data: result,
    });
  });



const deleteCourse = catchAsync(async(req, res)=>{
    const { id } = req.params;

    const result =  await CourseServices.deleteCourseFromDB(id);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Deleted Courses  is  successfully',
      data:result

    });
    console.log(result);
  });

  const assignFacultiesWithCourse = catchAsync(async(req, res)=>{
    const { courseId } = req.params;
    const {faculties}=req.body;

    const result =  await CourseServices.assignFacultiesWithCourseIntoDB(courseId,faculties);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Assign Faculty with Courses  is   retrieved successfully',
      data:result

    });
    console.log(result);
  });  

  const removeFacultiesWithCourse = catchAsync(async(req, res)=>{
    const { courseId } = req.params;
    const {faculties}=req.body;

    const result =  await CourseServices.removeFacultiesWithCourseFromDB(courseId,faculties);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Assign Faculty Removed successfully',
      data:result

    });
    console.log(result);
  });  




  export const CourseControllers ={
   createCourse,
   deleteCourse,
   getAllCourses,
   getSingleCourse,
   updateCourse,
   assignFacultiesWithCourse,
   removeFacultiesWithCourse
  }
  
