import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    id: string;
    password: string;
    needPasswordChange: boolean;
    passwordChangeAt?: Date,
    role: 'admin' | 'student' | 'faculty';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    isUserExistsByCustomId(id: string): Promise<TUser>;
    isUserDeleted(id: string): Promise<TUser>;
    isBlocked(id: string): Promise<boolean>;
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string)
        : Promise<boolean>; 
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamps: Date,
        jwtIssuedTimestamps: number,)
        : Promise<boolean>
}


export type TUserRole = keyof typeof USER_ROLE;