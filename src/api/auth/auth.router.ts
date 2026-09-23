import { validate } from "../../utils/validation-middleware";
import { Router } from "express";
import { confirmParams, loginDto, registerDto, resendDto } from "./auth.dto";
import { confirmRegistration, login, register, resendConfirmation } from "./auth.controller";

const router = Router();

router.post('/register', validate(registerDto, 'body'), register);
router.get('/register/confirm/:token', validate(confirmParams, 'params'), confirmRegistration);
router.post('/register/resend', validate(resendDto, 'body'), resendConfirmation);
router.post('/login', validate(loginDto, 'body'), login);

export default router;