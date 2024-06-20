import { object } from "joi";
import { z } from "zod";


const AcademicFacultyValidationSchema = z.object({
    body: z.object({
      name: z.string({
        invalid_type_error: 'Academic faculty must be string',
      }),
    }),
  });

const UpdateAcademicFacultyValidationSchema = z.object({
    body: z.object({
      name: z.string({
        invalid_type_error: 'Academic faculty must be string',
      }),
    }),
  });


export const  AcademicFacultyValidation={
    AcademicFacultyValidationSchema,
    UpdateAcademicFacultyValidationSchema
} 