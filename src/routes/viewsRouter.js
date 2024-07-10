import { Router } from "express";
import ProductController from "../controllers/productController.js";
import MessageController from "../controllers/messageController.js";
import CartController from "../controllers/cartController.js";
import UserController from "../controllers/userController.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import { generateProducts } from "../utils/fakerUtil.js";
import { transport } from "../utils/mailUtil.js";
import __dirname from "../utils/constantsUtil.js";
import { createHash, isValidPassword } from "../utils/functionUtil.js";

const router = Router();
const productController = new ProductController();
const cartController = new CartController();
const messageController = new MessageController();
const userController = new UserController();

// Home route
router.get("/", (req, res) => {
  res.render("home", {
    title: "FlameShop | Home",
    style: "index.css",
  });
});

// Login route
router.get("/login", async (req, res) => {
  if (req.cookies.auth) {
    res.redirect("/user");
  } else {
    res.render("login", {
      title: "FlameShop | Login",
      style: "index.css",
      failLogin: req.session.failLogin ?? false,
    });
  }
});

// Register route
router.get("/register", (req, res) => {
  if (req.cookies.auth) {
    res.redirect("/user");
  }
  res.render("register", {
    title: "FlameShop | Register",
    style: "index.css",
    failRegister: req.session.failRegister ?? false,
  });
});

// User route
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await userController.findUserById(req.user.user._id);
      res.render("user", {
        title: "FlameShop | Usuario",
        style: "index.css",
        user,
        cart: [],
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Products route
router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  auth("user"),
  async (req, res) => {
    let { limit = 5, page = 1 } = req.query;
    try {
      const user = await userController.findUserById(req.user.user._id);
      const products = await productController.getAllProducts(limit, page);
      res.render("products", {
        title: "Productos",
        style: "index.css",
        user,
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

// Real-time products route
router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  auth("admin"),
  async (req, res) => {
    try {
      const products = await productController.getAllProducts();
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

// Chat route
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
        messages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Cart route
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
        title: "FlameShop Cart",
        style: "index.css",
        cartId,
        products: cart.products || [],
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

// Mocking products route
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

// Logger test route
router.get("/loggertest", (req, res) => {
  req.logger.fatal("Logger test fatal message");
  req.logger.error("Logger test error message");
  req.logger.warning("Logger test warning message");
  req.logger.info("Logger test info message");
  req.logger.http("Logger test http message");
  req.logger.debug("Logger test debug message");

  res.send("Logger test completed!");
});

// Send email route
router.get("/send/mail", async (req, res) => {
  try {
    const result = await transport.sendMail({
      from: "JMG <jmgaleman@gmail.com>",
      to: "jmgaleman@gmail.com",
      subject: "Correo de prueba",
      html: `<div>
                <h1>We are testing!</h1>
                <p>Hello user welcome to FlameShop</p>
              </div>`,
    });

    res.send({ status: "success", result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: "error", message: "Error in send email!" });
  }
});

// Recover password routes
router.get("/recover", (_req, res) => {
  res.render("recoverView", {
    title: "Recover email",
    style: "index.css",
  });
});

router.get("/recover/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await userController.getUserByToken(token);
    if (!user) {
      return res.status(404).render("recoverView", { error: "Invalid token" });
    }
    res.render("changePasswordView", {
      title: "Change Password View",
      style: "index.css",
      user,
      token,
    });
  } catch (error) {
    console.error("Error in recover route:", error);
    res.status(500).render("recoverView", {
      error: "Token has expired. Please request a new password recovery link.",
      token,
    });
  }
});

router.post("/recover", async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  try {
    const result = await userController.sendPasswordRecoveryEmail(email);
    console.log(result);
    res.render("emailSent", {
      title: "Email Sent",
      style: "index.css",
      message: "Check your email for password recovery instructions",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error recovering password" });
  }
});

router.post("/changePassword", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await userController.getUserByToken(token);

    if (!user) {
      return res.status(404).json({ error: "Invalid token" });
    }

    if (isValidPassword(user, newPassword)) {
      return res
        .status(400)
        .json({ error: "New password cannot be the same as old password" });
    }

    const hashedPassword = createHash(newPassword);
    await userController.updatePassword(user._id, hashedPassword);
    res.json({ success: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Token has expired. Please request a new password recovery link.",
    });
  }
});

// Route for the "Email Sent" page
router.get("/email-sent", (req, res) => {
  res.render("emailSent", {
    title: "Email Sent",
    style: "index.css",
  });
});

export default router;