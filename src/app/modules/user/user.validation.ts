import { z } from "zod";


const userValidationSchema = z.object({
    id:z.string(),
    name:z.string(),
    password:z.string({  
        invalid_type_error: "Name must be a string",
    }).max(20,{message:"password can not be 20 char"}).optional(),

    // needPasswordChange:z.boolean().optional().default(true),
    // role:z.enum(['admin' , ' student' , 'faculty']),
    // status:z.enum(['in-progress' , 'blocked']),
    // isDeleted:z.boolean().optional()
})


export const  UserValidation={
    userValidationSchema
}