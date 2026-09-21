// src/api/categorie/categorie.router.ts

import { Router } from 'express';
import { validate } from '../../utils/validation-middleware';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';
import { createCategoria, getCategorie } from './categorie.controller';
import { CreateCategoriaDto } from './categorie.dto';

const categorieRouter = Router();

categorieRouter.get('/', isAuthenticated, getCategorie);
categorieRouter.post('/', isAuthenticated, validate(CreateCategoriaDto, 'body'), createCategoria);

export default categorieRouter;