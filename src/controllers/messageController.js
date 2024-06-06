import messageRepository from "../repository/messageRepository.js";

class MessageController {
  async getAllMessages() {
    try {
      return await messageRepository.getAllMessages();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching messages");
    }
  }

  async insertMessage(user, message) {
    try {
      return await messageRepository.insertMessage(user, message);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating new message");
    }
  }
}

const messageController = new MessageController();
export default messageController;