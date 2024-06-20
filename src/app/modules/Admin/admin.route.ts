import { Admin } from './admin.model';
import express from 'express';
import { AdminControllers } from './admin.controller';
import ValidationArmy from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';



const router = express.Router();


router.get('/', AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getSingleAdmin);

router.delete('/:id', AdminControllers.deleteAdmin);

router.patch('/:id',
ValidationArmy(updateAdminValidationSchema),
AdminControllers.updateAdmin);



export const AdminRoutes = router;