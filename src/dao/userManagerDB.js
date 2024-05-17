import { userModel } from "../dao/models/userModel.js";
import { isValidPassword } from "../utils/functionUtil.js";
import jwt from "jsonwebtoken";

export default class userManagerDB {
  async getUsers() {
    try {
      const result = await userModel
        .find({})
        .populate("cart")
        .populate("cart.products.product");
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async registerUser(user) {
    try {
      if (user.email == "admin@flameshop.com" && user.password == "admin12345") {
        const result = await userModel.create(user);
        result.role = "admin";
        result.save();
        return result;
      }
      const result = await userModel.create(user);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
 
  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error("Invalid credentials!");
    }
    try {
      const user = await userModel.findOne({ email }).lean();
      if (!user) throw new Error("Invalid user!");
      if (isValidPassword(user, password)) {
        const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });
        return { token, user };
      } else {
        throw new Error("Invalid Password!");
      }
    } catch (error) {
      throw new Error("Login Error!");
    }
  }

  async updateUser(userId, cartId) {
    try {
      const result = await userModel.findByIdAndUpdate(userId, {
        cart: cartId,
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async findUserEmail(email) {
    try {
      const result = await userModel.findOne({ email: email });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
