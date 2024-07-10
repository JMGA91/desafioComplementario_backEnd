import jwt from "jsonwebtoken";
import * as dotenv from "dotenv"; 
dotenv.config();

//console.log(process.env);

const secretKey = process.env.SECRET_KEY;

//console.log("SECRET_KEY:", process.env.SECRET_KEY);

const generateToken = (user) => {
  const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Split to get the token
  jwt.verify(token, secretKey, (error, credentials) => {
    if (error) {
      return res.status(403).send({ error: "Not authenticated" });
    }
    req.user = credentials.user;
    next();
  });
};

export { generateToken, authToken };
