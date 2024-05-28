import productModel from "../models/productModel.js";

class ProductDao {
  async getAllProducts(query, options) {
    return await productModel.paginate(query, options);
  }

  async getProductById(pid) {
    return await productModel.findOne({ _id: pid });
  }

  async createProduct(product) {
    return await productModel.create(product);
  }

  async updateProduct(pid, productUpdate) {
    return await productModel.updateOne({ _id: pid }, productUpdate);
  }

  async deleteProduct(pid) {
    return await productModel.deleteOne({ _id: pid });
  }
}

const productDao = new ProductDao();
export default productDao;
