import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        });

        if (!user) {
          return done(null, false, {
            message: "Invalid email or password"
          });
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValidPassword) {
          return done(null, false, {
            message: "Invalid email or password"
          });
        }

        return done(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;