import { Router } from "express";
import userController from "../controllers/userController.js";
import { generateToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";

const router = Router();

const userControllerDB = new userController();

router.get("/", async (req, res) => {
  try {
    const result = await userControllerDB.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    req.session.failLogin = false;
    const user = await userControllerDB.findUserEmail(email);
    if (!user || password !== user.password) {
      req.session.failLogin = true;
      console.log("contraseña incorrecta");
      return res.redirect("/login");
    }
    req.session.user = user;
    const access_token = generateToken(user);
    res.cookie("access_token", access_token).json("success", access_token);
    // res.redirect("/user");
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

// Route to switch user roles from common user to premium and vice versa
router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  auth("user"),
  async (req, res) => {
    try {
      const user = await userControllerDB.findUserById(req.params.uid);
      const roles = ["user", "premium"];

      if (req.user.user.role !== "user") {
        return res.status(401).json({
          error: "Unauthorized",
          message: "You do not have permission to access this page.",
        });
      }

      res.render("switchRole", {
        title: "Role Switcher",
        style: "index.css",
        user: user.user,
        role: roles,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.put(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { role } = req.body;
      console.log(`Updating role for user ${uid} to ${role}`); // Add this line
      const updatedUser = await userControllerDB.updateRole(uid, role);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error(`Error updating role: ${error.message}`); // Add this line
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;