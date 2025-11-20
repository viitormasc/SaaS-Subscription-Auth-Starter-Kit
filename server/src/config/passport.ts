import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import User from '../models/UserModel';
import { PassportStatic, serializeUser } from 'passport';
import type { DoneFunction } from '../types/types';
import { UserDocument, GoogleProfile } from '../types/interfaces';
import GoogleStrategy from 'passport-google-oidc';
import userServiceFactory from '../user/user.service'; // Import UserService factory

export default function (passport: PassportStatic) {
  // Initialize UserService with the User model
  const UserService = userServiceFactory(User);
  console.log(process.env.CALLBACK_URL);
  const options: IStrategyOptions = {
    usernameField: 'email',
    passReqToCallback: false,
  };

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: process.env.CALLBACK_URL as string,
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      async (issuer: string, profile: GoogleProfile, done: DoneFunction) => {
        if (!profile.emails || profile.emails.length === 0) {
          return done(null, false, { message: 'Google profile missing email' });
        }
        if (!profile.name) {
          return done(null, false, { message: 'Google profile missing name' });
        }
        /*          if (!profile.photos || profile.photos.length === 0) {
          return done(null, false, { message: 'Google profile missing photo' });
        }  */

        const id = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const source = 'google';

        const currentUser = await UserService.getUserByEmail({ email });
        if (!currentUser) {
          const newUser = await UserService.addGoogleUser({
            id,
            email,
            name,
            source,
          });

          return done(null, newUser);
        }
        if (currentUser.source !== 'google') {
          // return done(null, false, {
          //   message: `You have previously signed up with a different signin method`,
          // });
          return done(null, currentUser); // user will login with the same account created with local strategy
        }
        currentUser.lastVisited = new Date();
        return done(null, currentUser);
      },
    ),
  );
  passport.use(
    new LocalStrategy(options, async (email, password, done) => {
      try {
        console.log('email', email.toLowerCase());
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        if (user.source !== 'local') {
          return done(null, false, { message: `Account was created with ${user.source} login method` });
        }

        const isMatch = await new Promise<boolean>((resolve, reject) => {
          user.comparePassword(password, (err, match) => {
            if (err) return reject(err);
            resolve(!!match);
          });
        });

        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err as any);
      }
    }),
  );

  // serializeUser
  passport.serializeUser((user, done) => {
    done(null, (user as UserDocument)._id);
  });

  // ✅ deserializeUser with async/await (no callbacks to Mongoose)
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = (await User.findById(id).exec()) as UserDocument | null;
      // If you prefer a lean object:
      // const user = await User.findById(id).lean().exec();

      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err as any);
    }
  });
}
