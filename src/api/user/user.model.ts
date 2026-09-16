import { model, Schema } from "mongoose";
import { UserRecord } from "./user.entity";

/** Campi mai esposti via API: il tipo User non basta a runtime se si serializza il documento grezzo. */
const INTERNAL_JSON_FIELDS: (keyof UserRecord)[] = [
  'confirmationToken',
  'confirmationTokenExpires',
  'emailConfermata',
];

function sanitizeUserForApi(ret: Record<string, unknown>) {
  delete ret._id;
  delete ret.__v;
  for (const field of INTERNAL_JSON_FIELDS) {
    delete ret[field];
  }
  return ret;
}

const userSchema = new Schema<UserRecord>({
  email: { type: String, required: true, unique: true },
  nomeTitolare: { type: String, required: true },
  cognomeTitolare: { type: String, required: true },
  dataApertura: { type: Date, required: true },
  // Readme: IBAN caricato dopo la registrazione; lo yaml lo restituisce comunque (anche vuoto).
  iban: { type: String, default: '' },
  emailConfermata: { type: Boolean, default: false },
  // Usato da auth.confirmRegistration — vedi commento in user.entity (UserInternalFields)
  confirmationToken: { type: String },
  confirmationTokenExpires: { type: Date },
});

// unique + iban: '' per ogni nuovo utente: sparse non basta (sparse ignora solo campo assente, non stringa vuota).
userSchema.index(
  { iban: 1 },
  {
    unique: true,
    partialFilterExpression: { iban: { $ne: '' } },
  }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => sanitizeUserForApi(ret as Record<string, unknown>),
});

userSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => sanitizeUserForApi(ret as Record<string, unknown>),
});

export const UserModel = model<UserRecord>('User', userSchema);
