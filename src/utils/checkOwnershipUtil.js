import ProductController from "../controllers/productController.js";

const productController = new ProductController();

export const checkOwnership = async (pid, email) => {
  const product = await productController.getProductByID(pid);
  if (!product) return false;
  return product.owner === email;
};