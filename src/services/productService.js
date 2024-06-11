import ProductRepository from "../repository/productRepository.js";

export default class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(limit, page, query, sort) {
    const options = {};
    if (limit) options.limit = limit;
    if (page) options.page = page;
    if (sort) options.sort = sort;
    options.lean = true;

    return await this.productRepository.getAllProducts(
      limit,
      page,
      query,
      sort
    );
  }

  async getProductById(pid) {
    return await this.productRepository.getProductByID(pid);
  }

  async createProduct(product) {
    return await this.productRepository.createProduct(product);
  }

  async updateProduct(pid, productUpdate) {
    return await this.productRepository.updateProduct(pid, productUpdate);
  }

  async deleteProduct(pid) {
    return await this.productRepository.deleteProduct(pid);
  }
}