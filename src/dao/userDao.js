import { userModel } from "../models/userModel.js";

class UserDao {
  async getUsers() {
    return await userModel
      .find({})
      .populate("cart")
      .populate("cart.products.product");
  }

  async createUser(user) {
    return await userModel.create(user);
  }

  async findUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async updateUser(userId, cartId) {
    return await userModel.findByIdAndUpdate(userId, { cart: cartId });
  }

  async findUserById(userId) {
    return await userModel.findById(userId);
  }
}

const userDao = new UserDao();
export default userDao;