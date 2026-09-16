import { Router } from "express";
import authRouter from './auth/auth.routes';
import userRouter from './user/user.router';

const router = Router();

router.use(authRouter);
router.use('/account', userRouter);

export default router;
