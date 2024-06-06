import productRepository from "../repository/productRepository.js";

class ProductController {
  async getAllProducts(limit, page, query, sort) {
    try {
      return await productRepository.getAllProducts(limit, page, query, sort);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching products");
    }
  }

  async getProductByID(pid) {
    try {
      return await productRepository.getProductByID(pid);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching product");
    }
  }

  async createProduct(product) {
    try {
      return await productRepository.createProduct(product);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating product");
    }
  }

  async updateProduct(pid, productUpdate) {
    try {
      return await productRepository.updateProduct(pid, productUpdate);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product");
    }
  }

  async deleteProduct(pid) {
    try {
      return await productRepository.deleteProduct(pid);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Error deleting product ${pid}`);
    }
  }
}

export default ProductController;