import { object } from "joi";
import { z } from "zod";


const AcademicDepartmentValidationSchema = z.object({
    body: z.object({
      name: z.string({
        invalid_type_error: 'Academic department must be string',
        required_error:"Name is Required"
      }),
      academicFaculty:z.string({
        invalid_type_error: 'Academic faculty must be string',
        required_error:"faculty is required"
      })
    }),
  });

const UpdateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
          invalid_type_error: 'Academic department must be string',
          required_error:"Name is Required"
        }).optional(),
        academicFaculty:z.string({
          invalid_type_error: 'Academic faculty must be string',
          required_error:"faculty is required"
        }).optional()
      }),
    });
  


export const   AcademicDepartmentValidation={
    AcademicDepartmentValidationSchema,
    UpdateAcademicDepartmentValidationSchema
} 