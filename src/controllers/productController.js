import ProductService from "../services/productService.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(limit, page, query, sort) {
    try {
      return await this.productService.getAllProducts(limit, page, query, sort);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching products");
    }
  }

  async getProductByID(pid) {
    try {
      return await this.productService.getProductById(pid);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching product");
    }
  }

  async createProduct(product) {
    try {
      return await this.productService.createProduct(product);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating product");
    }
  }

  async updateProduct(pid, productUpdate) {
    try {
      return await this.productService.updateProduct(pid, productUpdate);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product");
    }
  }

  async deleteProduct(pid) {
    try {
      return await this.productService.deleteProduct(pid);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Error deleting product ${pid}`);
    }
  }
}

export default ProductController;