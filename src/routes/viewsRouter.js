import { Router } from "express";
import productController from "../controllers/productController.js";
import messageController from "../controllers/messageController.js";
import cartController from "../repository/cartRepository.js";
import userRepository from "../repository/userRepository.js";
import { authToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";

const router = Router();
const productControllerDB = new productController();
const cartControllerDB = new cartController();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Flameshop | Home",
    style: "index.css",
  });
});

router.get("/login", async (req, res) => {
  if (req.cookies.auth) {
    res.redirect("/user");
  } else {
    res.render("login", {
      title: "Flameshop | Login",
      style: "index.css",
      failLogin: req.session.failLogin ?? false,
    });
  }
});

router.get("/register", (req, res) => {
  if (req.cookies.auth) {
    res.redirect("/user");
  }
  res.render("register", {
    title: "Flameshop | Register",
    style: "index.css",
    failRegister: req.session.failRegister ?? false,
  });
});

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      res.render("user", {
        title: "Flameshop | Usuario",
        style: "index.css",
        user: req.user.user,
        cart: [],
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  auth("user"),
  async (req, res) => {
    let { limit = 5, page = 1 } = req.query;
    console.log(await userRepository.findUserById(req.user.user._id));
    try {
      res.render("products", {
        title: "Productos",
        style: "index.css",
        user: await userRepository.findUserById(req.user.user._id),
        products: await productControllerDB.getAllProducts(limit, page),
      });
    } catch (error) {
      res.status(403).send({
        status: "error",
        message: "Forbidden",
      });
    }
  }
);

router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  auth("admin"),
  async (req, res) => {
    try {
      const products = await productControllerDB.getAllProducts();
      res.render("realTimeProducts", {
        title: "Productos",
        style: "index.css",
        products,
      });
    } catch (error) {
      res.status(403).send({
        status: "error",
        message: "Forbidden",
      });
    }
  }
);

router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  auth("student"), // Only allow students
  async (req, res) => {
    try {
      const messages = await messageController.getAllMessages();
      res.render("messageService", {
        title: "Chat",
        style: "index.css",
        messages: messages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/cart",
  passport.authenticate("jwt", { session: false }), // Allow all authenticated users
  async (req, res) => {
    const cartId = req.query.cid;
    try {
      const cart = await cartControllerDB.getProductsFromCartByID(cartId);
      res.render("cart", {
        title: "Flameshop Cart",
        style: "index.css",
        cartId: cartId,
        products: cart.products,
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      res.redirect("/error");
    }
  }
);

// Unauthorized route
router.get("/unauthorized", (req, res) => {
  res.status(401).render("unauthorized", {
    title: "Unauthorized",
    style: "index.css",
  });
});

export default router;
