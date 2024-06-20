import express from 'express';
import { AcademicSemesterControllers } 
from './academicSemester.controller';
import ValidationArmy from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './academicSemesterValidation';

const router = express.Router();


router.post('/create-academic-semester',  
ValidationArmy(
    AcademicSemesterValidation.createAcademicValidationSchema
),
AcademicSemesterControllers.createAcademicSemester);


router.get('/:semesterId',
    AcademicSemesterControllers.getSingleAcademicSemester
)

router.patch(
    '/:semesterId',
   ValidationArmy(AcademicSemesterValidation.updateAcademicSemesterValidationSchema),
    AcademicSemesterControllers.updateAcademicSemester
)

router.get('/',
 AcademicSemesterControllers.getAllAcademicSemester)



export const AcademicSemesterRoutes = router;
