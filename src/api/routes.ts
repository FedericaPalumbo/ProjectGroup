import { Router } from "express";
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';

const router = Router();

router.use(authRouter);
router.use('/account', userRouter);

// TODO: montare qui i router mancanti non appena implementati, secondo lo yaml:
// router.use('/movimenti', movimentiRouter);  // GET /movimenti, GET /movimenti/:id
// router.use('/categorie', categorieRouter);  // GET /categorie
// router.use('/ricariche', ricaricheRouter);  // POST /ricariche
// router.use('/bonifici', bonificiRouter);    // POST /bonifici


export default router;
