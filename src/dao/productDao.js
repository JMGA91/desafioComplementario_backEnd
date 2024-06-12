import productModel from "../models/productModel.js";

export default class ProductDao {
  async getAll(query, options) {
    return await productModel.paginate(query, options);
  }

  async getById(pid) {
    return await productModel.findOne({ _id: pid });
  }

  async create(product) {
    return await productModel.create(product);
  }

  async update(pid, productUpdate) {
    return await productModel.updateOne({ _id: pid }, productUpdate);
  }

  async delete(pid) {
    return await productModel.deleteOne({ _id: pid });
  }
}