import { validationHandler } from './validation-error';
import { genericErrorHandler } from "./generic";
import { notFoundHandler } from "./not-found.error";
import { passwordMismatchHandler } from "./password-mismatch";
import { insufficientBalanceHandler } from "./insufficient-balance-error";
import { sameAccountHandler } from './same-credentials.error';
import { missingIbanHandler } from "./missing-iban.error";

export const errorHandlers = [validationHandler, notFoundHandler, passwordMismatchHandler, sameAccountHandler, insufficientBalanceHandler, missingIbanHandler, genericErrorHandler];