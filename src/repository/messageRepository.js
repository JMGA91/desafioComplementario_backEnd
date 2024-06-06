import MessageModel from "../models/messageModel.js";

class MessageRepository {
  async getAllMessages() {
    try {
      return await MessageModel.find().lean();
    } catch (error) {
      throw new Error("Error fetching messages: " + error.message);
    }
  }

  async insertMessage(user, message) {
    try {
      const newMessage = await MessageModel.create({ user, message });
      return newMessage.toObject();
    } catch (error) {
      throw new Error("Error creating new message: " + error.message);
    }
  }
}

const messageRepository = new MessageRepository();
export default messageRepository;
