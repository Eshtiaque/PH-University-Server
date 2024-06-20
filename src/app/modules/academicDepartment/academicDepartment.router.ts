import express from 'express';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import ValidationArmy from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';


const router = express.Router();

//academicFaculty faculty


router.post('/create-academic-department',
    ValidationArmy(
        AcademicDepartmentValidation.AcademicDepartmentValidationSchema
    ),
    AcademicDepartmentControllers.createAcademicDepartment);


router.get('/:departmentId',
AcademicDepartmentControllers.getSingleAcademicDepartment
)

router.patch(
    '/:departmentId',
    ValidationArmy(AcademicDepartmentValidation.UpdateAcademicDepartmentValidationSchema),
    AcademicDepartmentControllers.updateAcademicDepartment
)

router.get('/',
AcademicDepartmentControllers.getAllAcademicDepartment)



export const AcademicDepartmentRoutes = router;
