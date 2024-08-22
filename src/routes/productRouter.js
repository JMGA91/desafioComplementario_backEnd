import { Router } from "express";
import CustomError from "../services/errors/customError.js";
import { generateProductsErrorInfo } from "../services/errors/info.js";
import { ErrorCodes } from "../services/errors/enums.js";
import ProductController from "../controllers/productController.js";
import { uploader } from "../utils/multerUtil.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import productModel from "../models/productModel.js";
import { checkOwnership } from "../utils/checkOwnershipUtil.js";
import { transport } from "../utils/mailUtil.js";

const router = Router();
const productController = new ProductController();

router.get("/", async (req, res) => {
  try {
    let { limit, page, query, sort } = req.query;
    query = query ? JSON.parse(query) : {};
    limit = limit ? parseInt(limit) : undefined;
    page = page ? parseInt(page) : undefined;
    sort = sort ? JSON.parse(sort) : undefined;

    const result = await productController.getAllProducts(
      limit,
      page,
      query,
      sort
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  auth(["premium", "admin"]),
  uploader.array("thumbnails", 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map((file) => file.filename);
    }

    const { title, description, code, price, status, stock, category } =
      req.body;
    let { owner } = req.body;

    try {
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        typeof status === "undefined" ||
        !stock ||
        !category
      ) {
        const product = {
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          owner,
        };
        const errorInfo = generateProductsErrorInfo(product);
        return CustomError.createError({
          name: "Product creation error",
          cause: errorInfo,
          message: "Error trying to create Product",
          code: ErrorCodes.INVALID_TYPES_ERROR,
        });
      }

      if (req.user.user.role === "premium") {
        owner = req.user.user.email;
      } else {
        owner = "admin";
      }

      req.body.owner = owner;

      const result = await productController.createProduct(req.body);
      res.send({
        status: "success",
        payload: result,
      });
    } catch (error) {
      req.logger.warning("Cannot add product");
      res.status(400).send({
        status: "error",
        message: error.message,
        cause: error,
      });
    }
  }
);

router.put("/:pid", uploader.array("thumbnails", 3), async (req, res) => {
  if (req.files) {
    req.body.thumbnails = req.files.map((file) => file.filename);
  }

  try {
    const result = await productController.updateProduct(
      req.params.pid,
      req.body
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    req.logger.warning("Cannot update product");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  auth(["premium", "admin"]),
  async (req, res) => {
    try {
      const product = await productController.getProductByID(req.params.pid);
      const pid = req.params.pid;
      const email = req.user.user.email;
      let proceedWithDelete = true;

      if (!product) {
        return res.status(404).send({
          status: "error",
          message: "Product not found",
        });
      }

      // Check if the user is either an admin or the owner of the product
      if (req.user.user.role === "premium") {
        proceedWithDelete = await checkOwnership(pid, email);
      }

      if (proceedWithDelete) {
        await productController.deleteProduct(pid);

        // Notify the premium user
        if (req.user.user.role === "premium") {
          const mailOptions = {
            from: "Juan Manuel <jmgaleman@gmail.com>",
            to: email,
            subject: "Product Deleted",
            html: `<div>
                      <h1>Product Deleted</h1>
                      <p>Your product with ID ${pid} has been deleted.</p>
                   </div>`,
          };

          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
            } else {
              console.log("Email sent:", info.response);
              io.emit("emailSent", { message: "Email sent successfully!" });
            }
          });
        }

        // Fetch the updated product list
        const products = await productController.getAllProducts();

        io.emit("productDeleted", {
          message: "Product deleted successfully!",
          products,
        });

        return res.status(200).send({
          status: "success",
          message: "Product erased",
        });
      } else {
        return res.status(403).send({
          status: "error",
          message: "You do not have permissions to erase products",
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.get("/search", async (req, res) => {
  try {
    const { title } = req.query;
    let query = {};
    if (title) query = { title };

    const products = await productModel.find(query).explain("executionStats");

    res.send({
      status: "success",
      payload: products,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      payload: {
        message: error.message,
      },
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const result = await productController.getProductByID(req.params.pid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    req.logger.warning("Cannot get product");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;