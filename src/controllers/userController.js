import UserService from "../services/userService.js";
import UserDTO from "../dao/DTOs/userDto.js";
import { transport } from "../utils/mailUtil.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async registerUser(user) {
    const newUser = new UserDTO(user);
    try {
      return await this.userService.registerUser(newUser);
    } catch (error) {
      console.error(error);
    }
  }

  async loginUser(email, password) {
    try {
      return await this.userService.loginUser(email, password);
    } catch (error) {
      throw new Error("Login Error!");
    }
  }

  async updateUser(userId, cartId) {
    try {
      return await this.userService.updateUser(userId, cartId);
    } catch (error) {
      console.error(error);
    }
  }

  async findUserEmail(email) {
    try {
      return await this.userService.findUserEmail(email);
    } catch (error) {
      console.error(error);
    }
  }

  async findUserById(userId) {
    try {
      return await this.userService.findUserById(userId);
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(userId, newPassword) {
    return await this.userService.updatePassword(userId, newPassword);
  }

  async getUserByToken(token) {
    return await this.userService.getUserByToken(token);
  }

  async sendPasswordRecoveryEmail(email) {
    const user = await this.userService.findUserEmail(email);
    if (!user) {
      throw new Error("Email not found");
    }
    const token = jwt.sign({ email: user.email }, secretKey, {
      expiresIn: "1h",
    });
    const mailOptions = {
      from: "FlameShop <jmgaleman@gmail.com>",
      to: email,
      subject: "Password Recovery",
      html: `<div style="font-family: 'Montserrat', sans-serif; color: black;">
                    <h1>Change your password</h1>
                     <p>We have received a request to reset your password. If you did not made this request, please ignore this email.</p>
                    <p>To reset your password, click the following link:</p>
                    <p>This link will expire in 1 hour</p>
                     <a href="http://localhost:8080/recover/${token}">
                    <button class="button">Reset Password</button>
                     </div>`,
    };
    transport.sendMail(mailOptions, (error) => {
      if (error) {
        throw new Error("Error sending email");
      }
    });
  }

  async updateRole(uid, role) {
    try {
      const updatedUser = await this.userService.updateRole(uid, role);
      return updatedUser;
    } catch (error) {
      throw new Error("Error updating role: " + error.message);
    }
  }
}