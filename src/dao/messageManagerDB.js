import MessageModel from "./models/messageModel.js";

class MessageManagerDB {
  async getAllMessages() {
    try {
      return await MessageModel.find().lean();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching messages from database");
    }
  }

  async insertMessage(user, message) {
    try {
      const newMessage = await MessageModel.create({ user, message });
      return newMessage.toObject();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating new message");
    }
  }
}

const messagemanager = new MessageManagerDB();

export default messagemanager;
