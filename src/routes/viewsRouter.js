import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import messageManagerDB from "../dao/messageManagerDB.js";
import cartManagerDB from "../dao/cartManagerDB.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import { userModel } from "../dao/models/userModel.js";

const router = Router();
const productManagerService = new productManagerDB();
const cartManagerService = new cartManagerDB();

router.get("/", (req, res) => {
  res.render("home", {
    title: "FlameShop | Home",
    style: "index.css",
  });
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/user");
  } else {
    res.render("login", {
      title: "FlameShop | Login",
      style: "index.css",
      failLogin: req.session.failLogin ?? false,
    });
  }
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    res.redirect("/user");
  }
  res.render("register", {
    title: "FlameShop | Register",
    style: "index.css",
    failRegister: req.session.failRegister ?? false,
  });
});

router.get("/user", passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
    res.render("user", {
      title: "FlameShop | Usuario",
      style: "index.css",
      user: req.session.user,
      cart: user.cart?.products || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/products", async (req, res) => {
  let { limit = 5, page = 1 } = req.query;

  res.render("products", {
    title: "Productos",
    style: "index.css",
    products: await productManagerService.getAllProducts(limit, page),
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: await productManagerService.getAllProducts(),
  });
});

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageManagerDB.getAllMessages();
    res.render("messageService", {
      title: "Chat",
      style: "index.css",
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/cart", auth, async (req, res) => {
  const cartId = req.query.cid;
  try {
    const cart = await cartManagerService.getProductsFromCartByID(cartId);
    res.render("cart", {
      title: "FlameShop | Cart",
      style: "index.css",
      cartId: cartId,
      products: cart.products,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/error");
  }
});

export default router;
