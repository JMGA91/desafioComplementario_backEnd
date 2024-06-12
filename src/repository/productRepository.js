import ProductDao from "../dao/productDao.js";
import ProductDTO from "../dao/DTOs/productDto.js";

export default class ProductRepository {
  constructor() {
    this.productDao = new ProductDao();
  }

  async getAllProducts(limit, page, query, sort) {
    try {
      const options = {};
      if (limit) options.limit = limit;
      if (page) options.page = page;
      if (sort) options.sort = sort;
      options.lean = true;

      if (limit && page) {
        return await this.productDao.getAll(query ?? {}, options);
      } else {
        return await this.productDao.getAll(query ?? {}, { lean: true });
      }
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getProductByID(pid) {
    try {
      const product = await this.productDao.getById(pid);
      if (!product) throw new Error(`Product with ID ${pid} does not exist!`);
      return product;
    } catch (error) {
      throw new Error("Error fetching product: " + error.message);
    }
  }

  async createProduct(product) {
    const newProduct = new ProductDTO(product);
    const { title, description, code, price, stock, category, thumbnails } =
      newProduct;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Missing required fields for creating product");
    }

    try {
      const result = await this.productDao.create({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails ?? [],
      });
      return result;
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  }

  async updateProduct(pid, productUpdate) {
    try {
      const result = await this.productDao.update(pid, productUpdate);
      return result;
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async deleteProduct(pid) {
    try {
      const result = await this.productDao.delete(pid);
      if (result.deletedCount === 0)
        throw new Error(`Product with ID ${pid} does not exist!`);
      return result;
    } catch (error) {
      throw new Error(`Error deleting product ${pid}: " + error.message`);
    }
  }
}