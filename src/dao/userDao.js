import { userModel } from "../models/userModel.js";

export default class UserDao {
  async getAll() {
    return await userModel
      .find({})
      .populate("cart")
      .populate("cart.products.product");
  }

  async create(user) {
    return await userModel.create(user);
  }

  async findByEmail(email) {
    return await userModel.findOne({ email });
  }

  async update(userId, cartId) {
    return await userModel.findByIdAndUpdate(userId, { cart: cartId });
  }

  async findById(userId) {
    return await userModel.findById(userId);
  }
}