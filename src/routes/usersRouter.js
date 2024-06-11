import { Router } from "express";
import userController from "../controllers/userController.js";
import cartController from "../repository/cartRepository.js";
import { generateToken, authToken } from "../utils/utils.js";
import passport from "passport";

const router = Router();

const userControllerDB = new userController();
const cartControllerDB = new cartController();

router.get("/users", async (req, res) => {
  try {
    const result = await userControllerDB.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;
  try {
    const response = await userControllerDB.registerUser(user);
    const cart = await cartControllerDB.createCart();
    await userControllerDB.updateUser(response._id, cart._id);
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    req.session.failLogin = false;
    const user = await userControllerDB.findUserEmail(email);
    if (!user || password !== user.password) {
      req.session.failLogin = true;
      return res.redirect("/login");
    }
    req.session.user = user;
    const access_token = generateToken(user);
    res.cookie("access_token", access_token);
    res.redirect("/user");
  } catch (error) {
    console.error("Error during login:", error);
    req.session.failLogin = true;
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.clearCookie("access_token");
    res.redirect("/login");
  });
});

const filterUserData = (user) => {
  const { _id, password, role, __v, ...filteredUser } = user;
  return filteredUser;
};

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const filteredUser = filterUserData(req.user.user);
    res.send({
      status: "success",
      user: filteredUser,
    });
  }
);

export default router;