import { Router } from "express";
import userController from "../controllers/userController.js";
import { generateToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import { uploader } from "../utils/multerUtil.js";

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

// Route to switch user role
router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  auth(["user", "premium"]),
  async (req, res) => {
    try {
      const user = await userControllerDB.findUserById(req.params.uid);
      const roles = ["user", "premium"];

      // allow "user" or "premium" change roles
      if (
        req.user.user.role !== "user" &&
        req.user.user.role !== "premium"
      ) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "You do not have permission to access this page.",
        });
      }

      res.render("switchRole", {
        title: "Role Switcher",
        style: "index.css",
        user: user,
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

// Endpoint to render the documents view
router.get(
  "/:uid/documents",
  passport.authenticate("jwt", { session: false }),
  auth(["user", "premium"]),
  async (req, res) => {
    try {
      const user = await userControllerDB.findUserById(req.params.uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("User data:", user);
      res.render("documentsView", {
        title: "Documents Uploader",
        user: user,
        style: "index.css",
        userId: req.params.uid,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error rendering documents view",
        message: error.message,
      });
    }
  }
);

router.post(
  "/:uid/documents",
  uploader.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
    { name: "addressDocument", maxCount: 1 },
    { name: "statementDocument", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.params.uid;
      const files = req.files;

      console.log("Received files:", files);
      console.log("User ID:", userId);

      // Fetch the user from the database
      const user = await userControllerDB.findUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let documents = [];
      if (files.idDocument)
        documents.push({
          name: "ID Document",
          reference: `/public/img/documents/${files.idDocument[0].filename}`,
        });
      if (files.addressDocument)
        documents.push({
          name: "Address Document",
          reference: `/public/img/documents/${files.addressDocument[0].filename}`,
        });
      if (files.statementDocument)
        documents.push({
          name: "Bank Statement",
          reference: `/public/img/documents/${files.statementDocument[0].filename}`,
        });

      // Update user's documents
      await userControllerDB.updateUserDocuments(userId, documents);

      res
        .status(200)
        .json({ message: "Documents uploaded successfully.", documents });
    } catch (error) {
      console.error(`Error updating documents: ${error.message}`);
      res
        .status(500)
        .json({ error: "Error uploading documents", message: error.message });
    }
  }
);

// Updated endpoint to check documents before updating role to premium
router.put(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await userControllerDB.findUserById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const requiredDocs = [
        "ID Document",
        "Address Document",
        "Bank Statement",
      ];
      const userDocs = user.documents.map((doc) => doc.name);

      const hasAllDocs = requiredDocs.every((doc) => userDocs.includes(doc));

      if (!hasAllDocs) {
        return res
          .status(400)
          .json({ error: "User has not uploaded all the required documentation" });
      }

      const updatedUser = await userControllerDB.updateRole(userId, "premium");
      const newToken = generateToken(updatedUser);

      res.cookie("access_token", newToken);
      res
        .status(200)
        .json({ success: true, user: updatedUser, token: newToken });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating role", message: error.message });
    }
  }
);

router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  auth("admin"),
  async (req, res) => {
    try {
      const result = await userControllerDB.deleteUsers();
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

export default router;