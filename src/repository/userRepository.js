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

  async updatePassword(userId, newPassword) {
    try {
      return await this.userDao.updatePassword(userId, newPassword);
    } catch (error) {
      throw new Error("Error updating password: " + error.message);
    }
  }

  async getUserByToken(token) {
    try {
      return await this.userDao.getUserByToken(token);
    } catch (error) {
      throw new Error("Error getting user by token: " + error.message);
    }
  }

  async updateRole(userId, newRole) {
    return await this.userDao.updateRole(userId, newRole);
  }

  async updateUserDocuments(userId, documents) {
    try {
      return await this.userDao.updateUserDocuments(userId, documents);
    } catch (error) {
      throw new Error("Error updating user documents: " + error.message);
    }
  }

  async deleteUserByEmail(userId) {
    try {
      return await this.userDao.deleteByEmail(userId);
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  }

  async deleteUsers() {
    try {
      return await this.userDao.deleteUsers();
    } catch (error) {
      throw new Error("Error deleting users: " + error.message);
    }
  }
}