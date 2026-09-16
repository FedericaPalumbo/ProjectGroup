import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserExistsError } from '../../errors/user-exists.error';
import { NotFoundError } from '../../errors/not-found.error';
import { WrongCredentialsError } from '../../errors/wrong-credentials.error';
import { UserIdentityModel } from '../../utils/auth/local/user-identity.model';
import { User } from './user.entity';
import { UserModel } from './user.model';

const CONFIRMATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** toJSON aggiunge id (virtual Mongoose); il cast evita falsi negativi del type checker su UserRecord. */
function toPublicUser(doc: { toJSON(): unknown }): User {
  return doc.toJSON() as unknown as User;
}

export class UserService {
  async add(
    profile: Pick<User, 'nomeTitolare' | 'cognomeTitolare'>,
    credentials: { username: string; password: string }
  ): Promise<User> {
    const existingIdentity =
      await UserIdentityModel.findOne({ 'credentials.username': credentials.username });
    if (existingIdentity) {
      throw new UserExistsError();
    }

    const confirmationToken = randomBytes(32).toString('hex');

    const newUser = await UserModel.create({
      email: credentials.username,
      nomeTitolare: profile.nomeTitolare,
      cognomeTitolare: profile.cognomeTitolare,
      dataApertura: new Date(),
      iban: '',
      emailConfermata: false,
      confirmationToken,
      confirmationTokenExpires: new Date(Date.now() + CONFIRMATION_TOKEN_TTL_MS),
    });

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    await UserIdentityModel.create({
      provider: 'local',
      user: newUser,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });

    return toPublicUser(newUser);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? toPublicUser(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? toPublicUser(doc) : null;
  }

  async findByIban(iban: string): Promise<User | null> {
    if (!iban) {
      return null;
    }
    const doc = await UserModel.findOne({ iban });
    return doc ? toPublicUser(doc) : null;
  }

  /** Conferma email; il movimento "Apertura Conto" resta al modulo movimenti (chiamata da auth). */
  async confirmByToken(token: string): Promise<User> {
    const doc = await UserModel.findOne({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: new Date() },
    });
    if (!doc) {
      throw new NotFoundError();
    }

    doc.emailConfermata = true;
    doc.set('confirmationToken', undefined);
    doc.set('confirmationTokenExpires', undefined);
    await doc.save();

    return toPublicUser(doc);
  }

  async updatePassword(
    userId: string,
    vecchiaPassword: string,
    nuovaPassword: string
  ): Promise<User> {
    const identity = await UserIdentityModel.findOne({
      user: new Types.ObjectId(userId),
    });
    if (!identity?.credentials) {
      throw new NotFoundError();
    }

    const match = await bcrypt.compare(vecchiaPassword, identity.credentials.hashedPassword);
    if (!match) {
      throw new WrongCredentialsError();
    }

    identity.set('credentials.hashedPassword', await bcrypt.hash(nuovaPassword, 10));
    await identity.save();

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }
    return toPublicUser(user);
  }
}

export default new UserService();
