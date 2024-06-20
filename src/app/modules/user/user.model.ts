import bcrypt from 'bcrypt'
import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";


const userSchema = new Schema<TUser, UserModel>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    needPasswordChange: {
        type: Boolean,
        default: true
    },
    passwordChangeAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress'

    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_round),
    );
    next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});


// checking if the user is exist
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
}
// checking if the user is already deleted
userSchema.statics.isUserDeleted = async function (id: string) {
    return await User.findOne({ id, isDeleted: true });
}
// checking if the user is blocked
userSchema.statics.isBlocked = async function (id: string) {
    const user = await User.findOne({ id, status: 'blocked' });
    return !!user;
}
//checking if the password is correct
userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt.compare(
        plainTextPassword,
        hashedPassword,
    )
}

//checking if the access token is valid or not that means password issued time and created time compare for new token
userSchema.statics.isJWTIssuedBeforePasswordChanged =
    function (
        passwordChangedTimestamps: Date,
        jwtIssuedTimestamps: number
    ) 
    {
        const passwordChangeTime = new 
        Date(passwordChangedTimestamps).getTime()/1000;
        return passwordChangeTime>jwtIssuedTimestamps;
    }
export const User = model<TUser, UserModel>('User', userSchema)