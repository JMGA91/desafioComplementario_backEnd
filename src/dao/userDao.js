import { userModel } from "../models/userModel.js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export default class UserDao {
  async getAll() {
    return await userModel
      .find({})
      .populate("cart")
      .populate("cart.products.product")
      .lean();
  }

  async create(user) {
    return await userModel.create(user);
  }

  async findByEmail(email) {
    return await userModel.findOne({ email }).lean();
  }

  async update(userId, cartId) {
    return await userModel.findByIdAndUpdate(userId, { cart: cartId });
  }

  async findById(userId) {
    return await userModel.findById(userId).lean();
  }

  async updatePassword(userId, newPassword) {
    return await userModel.findByIdAndUpdate(userId, { password: newPassword });
  }

  async getUserByToken(token) {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    return await userModel.findOne({ email }).lean();
  }

  async updateRole(userId, newRole) {
    return await userModel.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );
  }

  async deleteByEmail(userId) {
    return await userModel.findOneAndDelete(userId).lean();
  }
}