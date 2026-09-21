import { Router } from "express";
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';
import categorieRouter from "./categorie/categorie.router";
import ricaricheRouter from './ricariche/ricariche.routes';
import movimentoRouter from "./movimenti/movimento.router";
import bonificoRouter from "./bonifico/bonifico.router";

const router = Router();

router.use(authRouter);
router.use('/account', userRouter);
router.use('/categorie', categorieRouter);
router.use('/ricariche', ricaricheRouter);
router.use('/movimenti', movimentoRouter);
router.use('/bonifici', bonificoRouter);


export default router;