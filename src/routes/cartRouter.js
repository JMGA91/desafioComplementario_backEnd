import { Router } from "express";
import cartRepository from "../repository/cartRepository.js";
import userController from "../controllers/userController.js";
import ticketRepository from "../repository/ticketRepository.js";

const router = Router();
const cartRepositoryDB = new cartRepository();
const userControllerDB = new userController();

router.get("/:cid", async (req, res) => {
  try {
    const result = await cartRepositoryDB.getProductsFromCartByID(
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
    const result = await cartRepositoryDB.createCart();
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
    const response = await userControllerDB.registerUser(user);
    const cart = await cartRepositoryDB.createCart();
    await userControllerDB.updateUser(response._id, { cart: cart._id });
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartRepositoryDB.getAllCarts();
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
    await cartRepositoryDB.addProductToCart(cartId, productId, quantity);
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
    const cart = await cartRepositoryDB.updateCart(cartId, products);
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
    await cartRepositoryDB.updateProductQuantity(cartId, productId, quantity);
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
    await cartRepositoryDB.deleteAllProductsFromCart(cartId);
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
    await cartRepositoryDB.deleteProductFromCart(cartId, productId);
    res.send(`Product ${productId} has been deleted from the cart`);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "there was an error deleting the product from the cart",
    });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  try {
    const results = await cartRepositoryDB.getStockfromProducts(req.params.cid);

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
    const cart = await cartRepositoryDB.getProductsFromCartByID(req.params.cid);

    let amount = 0;
    for (const cartProduct of cart.products) {
      amount += cartProduct.product.price * cartProduct.quantity;
    }

    const ticket = await ticketRepository.createTicket(
      purchaser,
      amount,
      cart.id
    );
    const notProcessed = await cartRepositoryDB.getStockfromProducts(
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
