import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt, { ExtractJwt } from "passport-jwt";
import { userModel } from "../models/userModel.js";
import userController from "../controllers/userController.js";
import cartController from "../repository/cartRepository.js";
import * as dotenv from "dotenv";
dotenv.config();

const userControllerDB = new userController();
const cartControllerDB = new cartController();

const JWTStrategy = jwt.Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.auth ?? null;
  }
  return token;
};

const initializePassport = () => {
  const Client_Id = process.env.CLIENT_ID;
  const Secret_Id = process.env.SECRET_ID;
  const secretKey = process.env.SECRET_KEY;

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secretKey,
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
        clientID: Client_Id,
        clientSecret: Secret_Id,
        callbackURL: "https://desafiocomplementario-backend.onrender.com/api/session/githubcallback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email =
            profile._json.email || `${profile._json.login}@github.com`;
          const user = await userModel.findOne({ email }); // Check if user already exists
          console.log("Existing User:", user);

          if (!user) {
            const newUser = {
              id: profile.id,
              firstName: profile._json.name,
              email: email,
              role: "user",
            };

            console.log("Creating new user:", newUser);

            const registeredUser = await userControllerDB.registerUser(newUser);
            const cart = await cartControllerDB.createCart(registeredUser._id);
            const updatedUser = await userControllerDB.updateUser(
              registeredUser._id,
              { cartId: cart._id }
            );

            console.log("Registered User:", updatedUser);
            user = updatedUser;
          }

          done(null, user);
        } catch (error) {
          console.error("Error in GitHub Strategy:", error);
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      console.log("Deserialized User:", user);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;