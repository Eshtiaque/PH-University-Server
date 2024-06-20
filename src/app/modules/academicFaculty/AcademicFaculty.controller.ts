//import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicFacultyService } from "./AcademicFaculty.service";


const createAcademicFaculty  = catchAsync(async (req, res) => {
  
      //const {password, student: studentData } = req.body;
      const result = await AcademicFacultyService.createAcademicFacultyIntoDB(req.body,);


      sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message :'Academic Faculty  is created successfully',
        data:result

      });

    
  });


  const getAllAcademicFaculty = catchAsync(async(req, res)=>{
    const result =  await
    AcademicFacultyService.getAllAcademicFacultiesFromDB();

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Academic Faculty  is retrieved successfully',
      data:result

    });
    console.log(result);
  });


  const getSingleAcademicFaculty = catchAsync(async(req, res)=>{
    const { facultyId } = req.params;

    const result =  await
    AcademicFacultyService.getSingleAcademicFacultyFromDB(facultyId);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Academic Faculty  is retrieved  by Id successfully',
      data:result

    });
    console.log(result);
  });


  const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const result = await AcademicFacultyService.updateAcademicFacultyDB(
      facultyId,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty is updated successfully',
      data: result,
    });
  });



  export const AcademicFacultyControllers ={
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty

  }
  