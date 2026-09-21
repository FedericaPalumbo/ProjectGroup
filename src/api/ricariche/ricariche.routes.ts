import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';
import { RicaricaDto } from './ricariche.dto';
import { doRicarica } from './ricariche.controller';

const router = Router();

router.post('/', isAuthenticated, validate(RicaricaDto, 'body'), doRicarica);

export default router;