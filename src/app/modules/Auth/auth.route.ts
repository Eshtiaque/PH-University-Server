import express from 'express';

import { AuthValidation } from './auth.validation';
import ValidationArmy from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  ValidationArmy(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);


router.post(
    '/change-password',
   auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ValidationArmy(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
  );
  
  router.post(
    '/refresh-token',
    ValidationArmy(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
  );




export const AuthRoutes = router;