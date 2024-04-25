import { userModel } from "../dao/models/userModel.js";

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
