import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { UserIdentityModel } from "./user-identity.model";
import { User } from "../../../api/user/user.entity";
import * as bcrypt from 'bcrypt';

passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(username, password, done) {
    try {
      const identity = await UserIdentityModel.findOne({ 'credentials.username': username});
      // non trovo l'utente
      if (!identity) {
        return done(null, false, { message: `email ${username} not found` });
      }

      const match = await bcrypt.compare(password, identity.credentials.hashedPassword);
      if (!match) {
        return done(null, false, { message: 'invalid password' });
      }

      // populate automatico nel model UserIdentity (pre findOne)
      const user = identity.toObject().user as User;

      done(null, user);

    } catch(err) {
      done(err);
    }
  })
);
