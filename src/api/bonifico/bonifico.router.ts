import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';
import { BonificoDto } from './bonifico.dto';
import { createBonifico } from './bonifico.controller';

const bonificoRouter = Router();

bonificoRouter.post('/', isAuthenticated, validate(BonificoDto, 'body'), createBonifico);

export default bonificoRouter;