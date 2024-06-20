import express from 'express';

import ValidationArmy from '../../middlewares/validateRequest';
import { courseValidation } from './Course.validation';
import { CourseControllers } from './Course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  ValidationArmy(courseValidation.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', 
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getSingleCourse);

router.get('/',
   CourseControllers.getAllCourses);

router.delete('/:id',
    auth(USER_ROLE.admin),
  CourseControllers.deleteCourse);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  ValidationArmy(courseValidation.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.put(
  '/:courseId/assign-faculty',
  ValidationArmy(courseValidation.FacultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculty',
  ValidationArmy(courseValidation.FacultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoute = router;