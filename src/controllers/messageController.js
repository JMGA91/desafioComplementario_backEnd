import MessageService from "../services/messageService.js";

class MessageController {
  constructor() {
    this.messageService = new MessageService();
  }

  async getAllMessages() {
    try {
      return await this.messageService.getAllMessages();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching messages");
    }
  }

  async insertMessage(user, message) {
    try {
      return await this.messageService.insertMessage(user, message);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating new message");
    }
  }
}

export default MessageController;