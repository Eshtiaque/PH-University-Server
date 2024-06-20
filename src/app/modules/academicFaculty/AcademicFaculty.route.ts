import express from 'express';
import { AcademicFacultyControllers } from './AcademicFaculty.controller';
import ValidationArmy from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './AcademicFaculty.validation';


const router = express.Router();

//academicFaculty faculty


router.post('/create-academic-faculty',
    ValidationArmy(
        AcademicFacultyValidation.AcademicFacultyValidationSchema
    ),
    AcademicFacultyControllers.createAcademicFaculty);


router.get('/:facultyId',
AcademicFacultyControllers.getSingleAcademicFaculty
)

router.patch(
    '/:facultyId',
    ValidationArmy(AcademicFacultyValidation.UpdateAcademicFacultyValidationSchema),
    AcademicFacultyControllers.updateAcademicFaculty
)

router.get('/',
    AcademicFacultyControllers.getAllAcademicFaculty)



export const AcademicFacultyRoutes = router;
