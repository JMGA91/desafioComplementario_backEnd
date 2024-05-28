import productModel from "../models/productModel.js";

class ProductController {
  async getAllProducts(limit, page, query, sort) {
    try {
      return await productModel.paginate(query ?? {}, {
        page: page ?? 1,
        limit: limit ?? 100,
        sort,
        lean: true,
      });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching products");
    }
  }

  async getProductByID(pid) {
    try {
      const product = await productModel.findOne({ _id: pid });
      if (!product) throw new Error(`Product with ID ${pid} does not exist!`);
      return product;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching product");
    }
  }

  async createProduct(product) {
    const { title, description, code, price, stock, category, thumbnails } =
      product;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Error creating product");
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
      console.error(error.message);
      throw new Error("Error creating product");
    }
  }

  async updateProduct(pid, productUpdate) {
    try {
      const result = await productModel.updateOne({ _id: pid }, productUpdate);
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product");
    }
  }

  async deleteProduct(pid) {
    try {
      const result = await productModel.deleteOne({ _id: pid });
      if (result.deletedCount === 0)
        throw new Error(`Product with ID ${pid} does not exist!`);
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error(`Error deleting product ${pid}`);
    }
  }
}

export default ProductController;
