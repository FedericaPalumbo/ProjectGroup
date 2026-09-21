import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';
import { changeIban, changePassword, confirmEmail, getAccountMe, getAccountProfile } from './user.controller';
import { confirmParams } from '../auth/auth.dto';
import { ChangeIbanDto, ChangePasswordDto } from './user.dto';

const router = Router();

router.get('/me', isAuthenticated, getAccountMe);
router.get('/profilo', isAuthenticated, getAccountProfile);
router.patch('/password', isAuthenticated, validate(ChangePasswordDto, 'body'), changePassword);
router.get('/email/confirm/:token', isAuthenticated, validate(confirmParams, 'params'), confirmEmail);
router.patch('/iban', isAuthenticated, validate(ChangeIbanDto, 'body'), changeIban);

export default router;
