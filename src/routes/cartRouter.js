import { Router } from "express";
import cartManagerDB from "../dao/cartManagerDB.js";
import userManagerDB from "../dao/userManagerDB.js";

const router = Router();
const cartManagerService = new cartManagerDB();
const userManagerService = new userManagerDB();

router.get("/:cid", async (req, res) => {
  try {
    const result = await cartManagerService.getProductsFromCartByID(
      req.params.cid
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await cartManagerService.createCart();
    res.send({
      status: "success",
      message: "Your cart has been successfully created",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;
  try {
    const response = await userManagerService.registerUser(user);
    const cart = await cartManagerService.createCart();
    await userManagerService.updateUser(response._id, { cart: cart._id });
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManagerService.getAllCarts();
    res.send({ carts });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await cartManagerService.addProductToCart(cartId, productId, quantity);
    res.send({
      status: "success",
      message: "Product has been added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error adding the product to the cart",
    });
  }
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;
  try {
    const cart = await cartManagerService.updateCart(cartId, products);
    res.send({ status: "success", message: "Your cart has been edited", cart });
  } catch (error) {
    console.error(error);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  try {
    await cartManagerService.updateProductQuantity(cartId, productId, quantity);
    res.send({ status: "success", message: "Quantity changed" });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error updating the product quantity",
    });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    await cartManagerService.deleteAllProductsFromCart(cartId);
    res.send("Cart has been deleted");
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ status: "error", error: "There was an error deleting the cart" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    await cartManagerService.deleteProductFromCart(cartId, productId);
    res.send(`Product ${productId} has been deleted from the cart`);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error deleting the product from the cart",
    });
  }
});

export default router;