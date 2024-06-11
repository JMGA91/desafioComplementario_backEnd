import MessageRepository from "../repository/messageRepository.js";

export default class MessageService {
  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async getAllMessages() {
    try {
      return await this.messageRepository.getAllMessages();
    } catch (error) {
      throw new Error("Error fetching messages: " + error.message);
    }
  }

  async insertMessage(user, message) {
    try {
      return await this.messageRepository.insertMessage(user, message);
    } catch (error) {
      throw new Error("Error creating new message: " + error.message);
    }
  }
}