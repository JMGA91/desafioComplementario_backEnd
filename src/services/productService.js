import productDao from "../dao/productDao.js";

class ProductService {
  async getAllProducts(limit, page, query, sort) {
    const options = { page: page ?? 1, limit: limit ?? 100, sort, lean: true };
    return await productDao.getAllProducts(query ?? {}, options);
  }

  async getProductById(pid) {
    return await productDao.getProductById(pid);
  }

  async createProduct(product) {
    return await productDao.createProduct(product);
  }

  async updateProduct(pid, productUpdate) {
    return await productDao.updateProduct(pid, productUpdate);
  }

  async deleteProduct(pid) {
    return await productDao.deleteProduct(pid);
  }
}

const productService = new ProductService();
export default productService;
