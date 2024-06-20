
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import ValidationArmy from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-semester-registration',
  ValidationArmy(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);


router.patch(
  '/:id',
  ValidationArmy(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);


router.delete(
  '/:id',
  SemesterRegistrationController.deleteSemesterRegistration,
);



export const semesterRegistrationRoutes = router;
