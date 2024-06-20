//import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterService } from "./academicSemester.service";


const createAcademicSemester  = catchAsync(async (req, res) => {
  
      //const {password, student: studentData } = req.body;
      const result = await AcademicSemesterService.createAcademicSemesterIntoDB(req.body,);


      sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message :'Academic semester  is created successfully',
        data:result

      });

    
  });


  const getAllAcademicSemester = catchAsync(async(req, res)=>{
    const result =  await
    AcademicSemesterService.getAllAcademicSemesterFromDB();

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Academic semester  is retrieved successfully',
      data:result

    });
    console.log(result);
  });


  const getSingleAcademicSemester = catchAsync(async(req, res)=>{
    const { semesterId } = req.params;

    const result =  await
    AcademicSemesterService.getSingleAcademicSemesterFromDB(semesterId);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Academic semester  is retrieved  by Id successfully',
      data:result

    });
    console.log(result);
  });


  const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterService.updateAcademicSemesterDB(
      semesterId,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester is retrieved successfully',
      data: result,
    });
  });



  export const AcademicSemesterControllers ={
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester
  }
  