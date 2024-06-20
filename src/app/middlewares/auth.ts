 // eslint-disable-next-line no-unexpected-multiline
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppErrors";
import httpStatus from "http-status";
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';


const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        ///if the token is send from the client
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are Unauthorized")
        }

        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;


        const { role, userId, iat } = decoded;

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

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not Authorized")
        }

        // decoded undefined
        req.user = decoded as JwtPayload;
        next();

    });

};

export default auth