import express from 'express';
import { userControllers } from './user.controller';

import { createStudentValidationSchema } from '../student/student.zod.validation';
import ValidationArmy from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();



router.post('/create-student',
  auth(USER_ROLE.admin),
  ValidationArmy(createStudentValidationSchema),
  userControllers.createStudent);


router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  ValidationArmy(createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post('/create-admin',
  ValidationArmy(createAdminValidationSchema),
  userControllers.CreateAdmin
)




export const UserRoutes = router;
