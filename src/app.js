import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";
import mongoose from "mongoose";
import mongoStore from "connect-mongo";
import session from "express-session";
import usersRouter from "./routes/usersRouter.js";
import passport from "passport";
import initializatePassport from "./config/passportConfig.js";
import sessionRouter from "./routes/sessionRouter.js";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const uri = process.env.URI;

const conexion = async () => {
  try {
    await mongoose.connect(uri, { dbName: "products" });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error.message);
  }
};

conexion();

//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/../views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "/path/to/js"));
app.use(cookieParser());

//Passport
initializatePassport();
app.use(passport.initialize());

// Use express-session before passport.session()
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: uri,
      ttl: 20,
    }),
    secret: "secretPhrase",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.session());

// Routers
app.use("/api/session", sessionRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Start server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io integration
const io = new Server(httpServer);
websocket(io);
