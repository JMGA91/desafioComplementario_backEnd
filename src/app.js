import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";
import mongoose from "mongoose";
import messagemanagerdb from "./dao/messageManagerDB.js";

const app = express();

const conexion = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Flame:h0zjMpQ1ABLDES5E@cluster0.f9ba6by.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { dbName: "products" }
    );
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

// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/products", viewsRouter);

// Start server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io integration
const io = new Server(httpServer);
websocket(io);

// Instantiate MessageManagerDB

// Handle Socket.io events
io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("message", async (data) => {
    console.log(`Message received from ${socket.id}: ${data.message}`);
    // Handle message logic here
    try {
      await messagemanagerdb.insertMessage(data.user, data.message);
      io.emit("messagesLogs", await messagemanagerdb.getAllMessages());
    } catch (error) {
      console.error("Error handling message:", error.message);
    }
  });

  socket.on("userConnect", async (data) => {
    try {
      socket.emit("messagesLogs", await messagemanagerdb.getAllMessages());
      socket.broadcast.emit("newUser", data);
    } catch (error) {
      console.error("Error handling user connection:", error.message);
    }
  });
});
