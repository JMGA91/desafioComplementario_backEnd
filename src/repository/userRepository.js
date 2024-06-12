import UserDao from "../dao/userDao.js";

export default class UserRepository {
  constructor() {
    this.userDao = new UserDao();
  }

  async getUsers() {
    try {
      return await this.userDao.getAll();
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }

  async createUser(user) {
    try {
      return await this.userDao.create(user);
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  }

  async findUserByEmail(email) {
    try {
      return await this.userDao.findByEmail(email);
    } catch (error) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }

  async updateUser(userId, cartId) {
    try {
      return await this.userDao.update(userId, cartId);
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async findUserById(userId) {
    try {
      return await this.userDao.findById(userId);
    } catch (error) {
      throw new Error("Error finding user by ID: " + error.message);
    }
  }
}