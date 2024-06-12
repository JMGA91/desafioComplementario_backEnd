import { Router } from "express";
import CartController from "../controllers/cartController.js";
import UserController from "../controllers/userController.js";
import TicketController from "../controllers/ticketController.js";

const router = Router();
const cartController = new CartController();
const userController = new UserController();
const ticketController = new TicketController();

router.get("/:cid", async (req, res) => {
  try {
    const result = await cartController.getProductsFromCartByID(req.params.cid);
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
    const result = await cartController.createCart();
    res.send({
      status: "success",
      message: "Cart successfully created!",
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
    const response = await userController.registerUser(user);
    const cart = await cartController.createCart();
    await userController.updateUser(response._id, { cart: cart._id });
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartController.getAllCarts();
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
  const quantity = req.body.quantity || 1;

  try {
    await cartController.addProductToCart(cartId, productId, quantity);
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
    const cart = await cartController.updateCart(cartId, products);
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
    await cartController.updateProductQuantity(cartId, productId, quantity);
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
    await cartController.deleteAllProductsFromCart(cartId);
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
    await cartController.deleteProductFromCart(cartId, productId);
    res.send(`Product ${productId} has been deleted from the cart`);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error deleting this product from the cart",
    });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  try {
    const results = await cartController.getStockFromProducts(req.params.cid);

    res.send({
      status: "success",
      payload: results,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:cid/purchase", async (req, res) => {
  try {
    const purchaser = req.user.email;
    const cart = await cartController.getProductsFromCartByID(req.params.cid);

    let amount = 0;
    for (const cartProduct of cart.products) {
      amount += cartProduct.product.price * cartProduct.quantity;
    }

    const ticket = await ticketController.createTicket(
      purchaser,
      amount,
      cart.id
    );
    const notProcessed = await cartController.getStockFromProducts(
      req.params.cid
    );

    req.params.cid = ticket;

    res.render("ticket", {
      title: "Ticket",
      ticket: ticket,
      notProcessed: notProcessed,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;