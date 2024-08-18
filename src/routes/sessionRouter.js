import { Router } from "express";
import userController from "../controllers/userController.js";
import passport from "passport";
import { generateToken } from "../utils/utils.js";
import { isValidPassword } from "../utils/functionUtil.js";
// Policies
import { auth } from "../middlewares/auth.js";
import CartController from "../controllers/cartController.js";

const sessionRouter = Router();
const userControllerDB = new userController();
const cartControllerDB = new CartController();

sessionRouter.get("/users", async (_req, res) => {
  try {
    const result = await userControllerDB.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

sessionRouter.post("/register", async (req, res) => {
  try {
    // Create the user
    const response = await userControllerDB.registerUser(req.body);

    // Create a cart
    const cart = await cartControllerDB.createCart();

    // Update the user with the cart ID
    await userControllerDB.updateUser(response._id, { cart: cart._id });

    // Render the login page
    res.render("login", {
      title: "FlameShop | Login",
      style: "index.css",
      failLogin: req.session.failLogin ?? false,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

sessionRouter.get("/failRegister", (_req, res) => {
  res.status(400).send({
    status: "error",
    message: "Failed Register",
  });
});

sessionRouter.post("/login", async (req, res) => {
  try {
    const user = await userControllerDB.findUserEmail(req.body.email);
    if (!user || !isValidPassword(user, req.body.password)) {
      return res.status(401).send({
        status: "error",
        message: "Error login!",
      });
    }
    const token = generateToken(user);
    res.cookie("auth", token, { maxAge: 60 * 60 * 1000, httpOnly: true });
    res.redirect("/user");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

sessionRouter.get("/failLogin", (_req, res) => {
  res.status(400).send({
    status: "error",
    message: "Failed Login",
  });
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      const token = generateToken(req.user);
      res.cookie("auth", token, { maxAge: 60 * 60 * 1000, httpOnly: true });
      res.redirect("/user");
    } else {
      res.redirect("/login");
    }
  }
);

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.clearCookie("auth");
    res.redirect("/login");
  });
});

sessionRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.send({
      user: req.user,
    });
  }
);

// Added
sessionRouter.get(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  auth("admin"),
  async (req, res) => {
    try {
      const result = await userControllerDB.getUsers(req.params.uid);
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
  }
);

export default sessionRouter;