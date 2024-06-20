//import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicDepartmentService } from "./academicDepartment.service";


const createAcademicDepartment  = catchAsync(async (req, res) => {
  
      //const {password, student: studentData } = req.body;
      const result = await AcademicDepartmentService.createAcademicDepartmentIntoDB(req.body,);


      sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message :'Academic Department   is created successfully',
        data:result

      });

    
  });


  const getAllAcademicDepartment = catchAsync(async(req, res)=>{
    const result =  await
    AcademicDepartmentService.getAllAcademicFacultiesFromDB();

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Academic Department  is retrieved successfully',
      data:result

    });
    console.log(result);
  });


  const getSingleAcademicDepartment = catchAsync(async(req, res)=>{
    const { departmentId} = req.params;

    const result =  await
    AcademicDepartmentService.getSingleAcademicDepartmentFromDB(departmentId);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message :'Academic Department  is retrieved  by Id successfully',
      data:result

    });
    console.log(result);
  });


  const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentService.updateAcademicDepartmentDB(
        departmentId,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is updated successfully',
      data: result,
    });
  });



  export const AcademicDepartmentControllers ={
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment

  }
  