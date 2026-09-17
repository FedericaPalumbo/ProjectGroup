import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';
import { ChangePasswordDto } from './user.dto';
import { changePassword, getAccountMe, getAccountProfile } from './user.controller';

const router = Router();

router.get('/me', isAuthenticated, getAccountMe);
router.get('/profilo', isAuthenticated, getAccountProfile);
router.patch('/password', isAuthenticated, validate(ChangePasswordDto, 'body'), changePassword);

export default router;
