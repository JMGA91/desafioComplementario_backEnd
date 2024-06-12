import UserService from "../services/userService.js";
import UserDTO from "../dao/DTOs/userDto.js";

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
}
