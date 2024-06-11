import { Router } from "express";
import ProductController from "../controllers/productController.js";
import MessageController from "../controllers/messageController.js";
import CartController from "../controllers/cartController.js";
import UserController from "../controllers/userController.js";
import TicketController from "../controllers/ticketController.js";
import { authToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import { generateProducts } from "../utils/fakerUtil.js";

const router = Router();
const productController = new ProductController();
const cartController = new CartController();
const messageController = new MessageController();
const userController = new UserController();
const ticketController = new TicketController();

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
    try {
      res.render("products", {
        title: "Productos",
        style: "index.css",
        user: await userController.findUserById(req.user.user._id),
        products: await productController.getAllProducts(limit, page),
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
      const products = await productController.getAllProducts();
      res.render("realTimeProducts", {
        title: "Products",
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
  auth("user"),
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
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let cartId = req.query.cid;
    try {
      if (!cartId) {
        const newCart = await cartController.createCart();
        cartId = newCart._id;
        return res.redirect(`/cart?cid=${cartId}`);
      }
      const cart = await cartController.getProductsFromCartByID(cartId);
      res.render("cart", {
        title: "Flameshop Cart",
        style: "index.css",
        cartId: cartId,
        products: cart.products || [],
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      res.redirect("/error");
    }
  }
);

router.get("/unauthorized", (req, res) => {
  res.status(401).render("unauthorized", {
    title: "Unauthorized",
    style: "index.css",
  });
});

router.get(
  "/ticket/:tid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const ticket = await ticketController.getTicketById(req, res);
      res.render("ticket", {
        title: "Ticket",
        style: "index.css",
        ticket: ticket.payload,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/mockingproducts", (req, res) => {
  const productsPerPage = 5;
  const currentPage = parseInt(req.query.page) || 1;
  const totalProducts = 100;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
  const currentProducts = generateProducts().slice(startIndex, endIndex);

  res.render("mockingProducts", {
    title: "Mocking Products",
    style: "index.css",
    products: currentProducts,
    prevPage,
    nextPage,
    pages,
  });
});

export default router;