// src/api/categorie/categorie.controller.ts

import { Request, NextFunction, Response } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import { CreateCategoriaDto } from './categorie.dto';
import CategorieService from './categorie.service';
import { CategoriaExistsError } from '../../errors/categoria-exists.error';

/** GET /categorie — lista categorie movimento (per popolare dropdown/filtri nel frontend). */
//getCategorie: ritorna tutte le categorie tramite CategorieService.findAll()
export const getCategorie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorie = await CategorieService.findAll();
    res.json(categorie);
  } catch (err) {
    next(err);
  }
};


export const createCategoria = async (
  req: TypedRequest<CreateCategoriaDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoria = await CategorieService.add(req.body);
    res.status(201).json(categoria);
  } catch (err) {
    if (err instanceof CategoriaExistsError) {
      res.status(400).json({ error: err.name, message: err.message });
      return;
    }
    next(err);
  }
};