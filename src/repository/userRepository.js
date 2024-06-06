import userDao from "../dao/userDao.js";

class UserRepository {
  async getUsers() {
    try {
      return await userDao.getUsers();
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }

  async createUser(user) {
    try {
      return await userDao.createUser(user);
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  }

  async findUserByEmail(email) {
    try {
      return await userDao.findUserByEmail(email);
    } catch (error) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }

  async updateUser(userId, cartId) {
    try {
      return await userDao.updateUser(userId, cartId);
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async findUserById(userId) {
    try {
      return await userDao.findUserById(userId);
    } catch (error) {
      throw new Error("Error finding user by ID: " + error.message);
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
