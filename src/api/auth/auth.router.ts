import { validate } from "../../utils/validation-middleware";
import { Router } from "express";
import { confirmParams, loginDto, registerDto } from "./auth.dto";
import { confirmRegistration, login, register } from "./auth.controller";

const router = Router();

router.post('/register', validate(registerDto, 'body'), register);
router.get('/register/confirm/:token', validate(confirmParams, 'params'), confirmRegistration);
router.post('/login', validate(loginDto, 'body'), login);

export default router;