import { UserExistsError } from "./user-exists.error";

export class CategoriaExistsError extends UserExistsError {
  constructor() {
    super();
    this.name = 'CategoryExists';
    this.message = 'category already exists';
  }
}