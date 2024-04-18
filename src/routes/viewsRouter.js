import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import messageManagerDB from "../dao/messageManagerDB.js";
import cartManagerDB from "../dao/cartManagerDB.js";

const router = Router();
const productService = new productManagerDB();
const cartService = new cartManagerDB();

router.get("/", async (req, res) => {
  let { limit = 3, page = 1 } = req.query;

  res.render("index", {
    title: "Productos",
    style: "index.css",
    products: await productService.getAllProducts(limit, page),
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: await productService.getAllProducts(),
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

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartService.getProductsFromCartByID(cartId);
    res.render("cart", {
      title: "Cart",
      style: "index.css",
      products: cart.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
