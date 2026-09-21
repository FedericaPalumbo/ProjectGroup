import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';
import { IdParams } from '../../utils/id-params';
import { ListMovimentiQueryDto } from './movimento.dto';
import { getMovimento, listMovimenti } from './movimento.controller';

const router = Router();

router.get('/', isAuthenticated, validate(ListMovimentiQueryDto, 'query'), listMovimenti);
router.get('/:id', isAuthenticated, validate(IdParams, 'params'), getMovimento);

export default router;