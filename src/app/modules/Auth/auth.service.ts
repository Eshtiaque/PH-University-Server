import httpStatus from "http-status";
import AppError from "../../errors/AppErrors";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { JwtPayload } from 'jsonwebtoken'
import config from "../../config";
import bcrypt from 'bcrypt'
import { createToken } from "./auth.utils";
import jwt from 'jsonwebtoken'




const loginUser = async (payload: TLoginUser) => {
    //checking if the user is exists
    const user = await User.isUserExistsByCustomId(payload?.id);
    console.log(user);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = await User.isUserDeleted(payload?.id)


    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is already blocked
    const isBlocked = await User.isBlocked(user?.status)


    if (isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked !');
    }
    // checking if the password is correct 
    const isPasswordMatch = await User.isPasswordMatched(payload.password, user.password)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }
    //access granted send access token , refresh token and sent to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,

    )

    //refresh token
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,

    )


    return {
        accessToken,
        refreshToken,
        needPasswordChange: user?.needPasswordChange,
    };
}

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {

    //checking if the user is exists
    const user = await User.isUserExistsByCustomId(userData?.userId);
    console.log(user);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = await User.isUserDeleted(user?.id)


    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is already blocked
    const isBlocked = await User.isBlocked(user?.status)


    if (isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked !');
    }
    // checking if the password is correct 
    const isPasswordMatch = await User.isPasswordMatched(payload.oldPassword, user?.password)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }



    //hast new password
    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_round)
    )


    await User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    },
        {
            password: newHashedPassword,
            needPasswordChange: false,
            passwordChangeAt: new Date(),
        }
    )
    return null;
}

const refreshToken = async (token: string) => {
    ///if the token is send from the client
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are Unauthorized")
    }

    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;


    const { userId, iat } = decoded;

    //condition validation start
    //checking if the user is exists
    const user = await User.isUserExistsByCustomId(userId);
    console.log(user);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = await User.isUserDeleted(userId)


    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is already blocked
    const isBlocked = await User.isBlocked(user?.status)


    if (isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked !');
    }
    //condition validation end


    if (
        user.passwordChangeAt && await
            User.isJWTIssuedBeforePasswordChanged(user.passwordChangeAt,
                iat as number)
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');

    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,

    )

    return {
        accessToken,
    }
}



export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken

};