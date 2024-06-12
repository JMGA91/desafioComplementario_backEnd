import MessageDao from "../dao/messageDao.js";

export default class MessageRepository {
  constructor() {
    this.messageDao = new MessageDao();
  }

  async getAllMessages() {
    try {
      return await this.messageDao.getAll();
    } catch (error) {
      throw new Error("Error fetching messages: " + error.message);
    }
  }

  async insertMessage(user, message) {
    try {
      const newMessage = await this.messageDao.insert(user, message);
      return newMessage.toObject();
    } catch (error) {
      throw new Error("Error creating new message: " + error.message);
    }
  }
}