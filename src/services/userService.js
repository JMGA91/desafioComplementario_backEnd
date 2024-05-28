import userDao from "../dao/userDao.js";
import { isValidPassword } from "../utils/functionUtil.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

class UserService {
  async getUsers() {
    return await userDao.getUsers();
  }

  async registerUser(user) {
    if (
      user.email == "admin@flameshop.com" &&
      isValidPassword(user, "admin12345")
    ) {
      const result = await userDao.createUser(user);
      result.role = "Admin";
      await result.save();
      return result;
    }
    return await userDao.createUser(user);
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error("Invalid credentials!");
    }
    const user = await userDao.findUserByEmail(email);
    if (!user) throw new Error("Invalid user!");

    if (isValidPassword(user, password)) {
      const token = jwt.sign(user, secretKey, { expiresIn: "2h" });
      return { token, user };
    } else {
      throw new Error("Invalid Password!");
    }
  }

  async updateUser(userId, cartId) {
    return await userDao.updateUser(userId, cartId);
  }

  async findUserEmail(email) {
    return await userDao.findUserByEmail(email);
  }
}

const userService = new UserService();
export default userService;
