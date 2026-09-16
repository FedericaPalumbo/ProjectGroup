import { validate } from "../../utils/validation-middleware";
import { Router } from "express";
import { loginDto, registerDto } from "./auth.dto";
import { login, register } from "./auth.controller";

const router = Router();

router.post('/register', validate(registerDto, 'body'), register);
router.post('/login', validate(loginDto, 'body'), login);

export default router;