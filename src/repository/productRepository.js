import productModel from "../models/productModel.js";
import ProductDTO from "../dao/DTOs/productDto.js";

class ProductRepository {
  async getAllProducts(limit, page, query, sort) {
    try {
      return await productModel.paginate(query ?? {}, {
        page: page ?? 1,
        limit: limit ?? 100,
        sort,
        lean: true,
      });
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getProductByID(pid) {
    try {
      const product = await productModel.findOne({ _id: pid });
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
      const result = await productModel.create({
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
      const result = await productModel.updateOne({ _id: pid }, productUpdate);
      return result;
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async deleteProduct(pid) {
    try {
      const result = await productModel.deleteOne({ _id: pid });
      if (result.deletedCount === 0)
        throw new Error(`Product with ID ${pid} does not exist!`);
      return result;
    } catch (error) {
      throw new Error(`Error deleting product ${pid}: " + error.message`);
    }
  }
}

const productRepository = new ProductRepository();
export default productRepository;
