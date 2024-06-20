import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";



const loginUser = catchAsync(async(req,res)=>{
    const result=  await AuthServices.loginUser(req.body);
    const {accessToken,
      refreshToken,
      needPasswordChange } = result;

    res.cookie('refreshToken', refreshToken, {
      secure:config.node_env==='production',
      httpOnly:true,
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully!',
        data:{
          accessToken,
          needPasswordChange,
        }
      });
})

const changePassword = catchAsync(async (req, res) => {
  
  const { ...passwordData } = req.body;
  const result=  await AuthServices.changePassword(req.user,passwordData)
 console.log(req.user, req.body);
 
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Password is changed successfully!',
      data:result
    });
})


const refreshToken = catchAsync(async (req, res) => {
  //const refreshToken = req.cookies.refreshToken;
  const {refreshToken} = req.cookies;
  const result=  await AuthServices.refreshToken(refreshToken);

  res.cookie('refreshToken', refreshToken, {
    secure:config.node_env==='production',
    httpOnly:true,
  })

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access Token is Retrieved successfully!',
      data:result
    });
})


export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
  };
