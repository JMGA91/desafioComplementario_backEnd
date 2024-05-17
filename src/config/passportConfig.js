import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { userModel } from "../dao/models/userModel.js";
import userManagerDB from "../dao/userManagerDB.js";
import cartManagerDB from "../dao/cartManagerDB.js";
import * as dotenv from "dotenv";
dotenv.config();

const userManagerService = new userManagerDB();
const cartManagerService = new cartManagerDB();

const { Strategy: JWTStrategy, ExtractJwt } = jwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.auth ?? null;
  }
  return token;
};

const initializePassport = () => {
  const Cliend_Id = process.env.CLIENT_ID;
  const Secret_Id = process.env.SECRET_ID;
  const secretKey = process.env.SECRET_KEY;

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secretKey, // Make sure `secretKey` is properly defined
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );  

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: Cliend_Id,
        clientSecret: Secret_Id,
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({
            email: profile._json.email,
          });
          console.log(profile);
          if (!user) {
            const newUser = {
              id: profile._id,
              username: profile._json.login,
              firstName: profile._json.name,
              email: profile._json.email,
              role: "user",
            };

            const registeredUser = await userManagerService.registerUser(
              newUser
            );
            const cart = await cartManagerService.createCart(
              registeredUser._id
            );
            const result = await userManagerService.updateUser(
              registeredUser._id,
              cart._id
            );
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;