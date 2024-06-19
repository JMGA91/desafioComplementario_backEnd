import { Router } from "express";
import CustomError from "../services/errors/CustomError.js";
import { generateProductsErrorInfo } from "../services/errors/info.js";
import { ErrorCodes } from "../services/errors/enums.js";
import ProductController from "../controllers/productController.js";
import { uploader } from "../utils/multerUtil.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import productModel from "../models/productModel.js";

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
  auth("admin"),
  uploader.array("thumbnails", 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map((file) => file.filename);
    }

    const { title, description, code, price, status, stock, category } =
      req.body;

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
      };
      const errorInfo = generateProductsErrorInfo(product);
      return CustomError.createError({
        name: "Product creation error",
        cause: errorInfo,
        message: "Error trying to create Product",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }

    try {
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

router.delete("/:pid", async (req, res) => {
  try {
    const result = await productController.deleteProduct(req.params.pid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    req.logger.warning("Cannot delete product");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

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