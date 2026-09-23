import { validationHandler } from './validation-error';
import { genericErrorHandler } from "./generic";
import { notFoundHandler } from "./not-found.error";
import { passwordMismatchHandler } from "./password-mismatch";
import { insufficientBalanceHandler } from "./insufficient-balance-error";
import { missingIbanHandler } from './missing-iban.error';
import { alreadyConfirmedHandler } from './already-confirmed.error';

export const errorHandlers = [validationHandler, notFoundHandler, passwordMismatchHandler, insufficientBalanceHandler, missingIbanHandler, alreadyConfirmedHandler, genericErrorHandler];