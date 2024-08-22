import UserRepository from "../repository/userRepository.js";
import { createHash, isValidPassword } from "../utils/functionUtil.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import * as dotenv from "dotenv";

//dotenv.config();

const secretKey = process.env.SECRET_KEY;

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return await this.userRepository.getUsers();
  }

  async registerUser(user) {
    if (
      user.email == "admin@flameshop.com" &&
      isValidPassword(user, "admin12345")
    ) {
      const result = await this.userRepository.createUser(user);
      result.role = "admin";
      await result.save();
      return result;
    }
    return await this.userRepository.createUser(user);
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error("Invalid credentials!");
    }
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new Error("Invalid user!");

    if (isValidPassword(user, password)) {
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
      return { token, user };
    } else {
      throw new Error("Invalid Password!");
    }
  }

  async updateUser(userId, cartId) {
    return await this.userRepository.updateUser(userId, cartId);
  }

  async findUserEmail(email) {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserById(userId) {
    return await this.userRepository.findUserById(userId);
  }

  async updatePassword(userId, newPassword) {
    return await this.userRepository.updatePassword(userId, newPassword);
  }

  async getUserByToken(token) {
    return await this.userRepository.getUserByToken(token);
  }

  async updateRole(userId, newRole) {
    if (!["user", "premium", "admin"].includes(newRole)) {
      throw new Error("Invalid role");
    }

    const updatedUser = await this.userRepository.updateRole(userId, newRole);

    if (!updatedUser) throw new Error("User not found");

    // Update last_connection after role is updated
    await userModel.findByIdAndUpdate(userId, { last_connection: new Date() });

    return updatedUser;
  }

  async updateUserDocuments(userId, documents) {
    return await this.userRepository.updateUserDocuments(userId, documents);
  }

  async deleteUserByEmail(userId) {
    return await this.userRepository.deleteUserByEmail(userId);
  }

  async deleteUsers() {
    return await this.userRepository.deleteUsers();
  }
}