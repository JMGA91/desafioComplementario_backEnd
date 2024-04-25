import { Router } from "express";
import userManagerDB from "../dao/userManagerDB.js";
import cartManagerDB from "../dao/cartManagerDB.js";

const router = Router();

const userManagerService = new userManagerDB();
const cartManagerService = new cartManagerDB();

router.get("/users", async (req, res) => {
  try {
    const result = await userManagerService.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;
  try {
    const response = await userManagerService.registerUser(user);
    const cart = await cartManagerService.createCart();

    await userManagerService.updateUser(response._id, cart._id);
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    req.session.failLogin = false;
    const user = await userManagerService.findUserEmail(email);

    if (!user) {
      req.session.failLogin = true;
      return res.redirect("/login");
    }

    if (password !== user.password) {
      req.session.failLogin = true;
      return res.redirect("/login");
    }

    req.session.user = user;
    res.redirect("/user");
  } catch (error) {
    console.error("Error during login:", error);
    req.session.failLogin = true;
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});

export default router;
