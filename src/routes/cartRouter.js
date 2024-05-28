import { Router } from "express";
import cartController from "../controllers/cartController.js";
import userController from "../controllers/userController.js";

const router = Router();
const cartControllerDB = new cartController();
const userManagerService = new userController();

router.get("/:cid", async (req, res) => {
  try {
    const result = await cartControllerDB.getProductsFromCartByID(
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
    const result = await cartControllerDB.createCart();
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
    const cart = await cartControllerDB.createCart();
    await userManagerService.updateUser(response._id, { cart: cart._id });
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartControllerDB.getAllCarts();
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
    await cartControllerDB.addProductToCart(cartId, productId, quantity);
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
    const cart = await cartControllerDB.updateCart(cartId, products);
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
    await cartControllerDB.updateProductQuantity(cartId, productId, quantity);
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
    await cartControllerDB.deleteAllProductsFromCart(cartId);
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
    await cartControllerDB.deleteProductFromCart(cartId, productId);
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