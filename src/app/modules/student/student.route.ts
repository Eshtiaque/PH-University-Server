import express from 'express';
import { StudentControllers } from './student.controller';
import ValidationArmy from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.zod.validation';

const router = express.Router();


router.get('/', StudentControllers.getAllStudents);

router.get('/:id', StudentControllers.getSingleStudent);

router.patch(
    '/:id',
    ValidationArmy(updateStudentValidationSchema),
    StudentControllers.updateStudent,
  )
  
router.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = router;
