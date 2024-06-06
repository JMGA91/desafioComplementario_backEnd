import productController from "./controllers/productController.js";
import userManagerDB from "./controllers/userController.js";
import cartController from "./repository/cartRepository.js";

const UserManager = new userManagerDB();
const ProductService = new productController();
const CartManager = new cartController();

export default (io) => {
  io.on("connection", (socket) => {
    socket.on("createProduct", async (data) => {
      try {
        console.log("DATA CREATE => ", data);
        await ProductService.createProduct(data);
        const products = await ProductService.getAllProducts();
        socket.emit("publishProducts", products.docs);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

    socket.on("deleteProduct", async (data) => {
      try {
        const result = await ProductService.deleteProduct(data.pid);
        socket.emit("publishProducts", result);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

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

    socket.on("registerUser", async (userData) => {
      try {
        await UserManager.registerUser(userData);
        socket.emit("registrationSuccess", "User registered successfully!");
      } catch (error) {
        socket.emit("registrationError", error.message);
      }
    });

    socket.on("loginUser", async (loginData) => {
      try {
        const user = await UserManager.authenticateUser(loginData);
        socket.emit("loginSuccess", user);
      } catch (error) {
        socket.emit("loginError", error.message);
      }
    });

    socket.on("logoutUser", async () => {
      try {
        // Handle logout logic
      } catch (error) {
        // Handle errors
      }
    });

    socket.on("addProductToCart", async (data) => {
      try {
        const { cartId, productId, quantity } = data;
        const cart = await CartManager.addProductToCart(
          cartId,
          productId,
          quantity
        );
        // Emit event to update client-side cart
        io.emit("cartUpdated", cart);
      } catch (error) {
        // Handle errors
        console.error(error.message);
        socket.emit("cartError", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};