import { Router } from "express";
import userManagerDB from "../dao/userManagerDB.js";
import passport from "passport";

const sessionRouter = Router();

const userManagerService = new userManagerDB();

sessionRouter.get("/users", async (req, res) => {
  try {
    const result = await userManagerService.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
  }
});

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/session/failRegister",
  }),
  async (req, res) => {
    res.redirect("/login");
  }
);

sessionRouter.get("/failRegister", (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Failed Register",
  });
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/session/failLogin" }),
  (req, res) => {
    if (!req.user) {
      return res.send(401).send({
        status: "error",
        message: "Error login!",
      });
    }
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };

    res.redirect("/login");
  }
);

sessionRouter.get("/failLogin", (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Failed Login",
  });
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {
    res.send({
      status: "success",
      message: "Success",
    });
  }
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});

export default sessionRouter;
