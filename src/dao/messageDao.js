import MessageModel from "../models/messageModel.js";

class MessageDao {
  async getAllMessages() {
    return await MessageModel.find().lean();
  }

  async insertMessage(user, message) {
    return await MessageModel.create({ user, message });
  }
}

const messageDao = new MessageDao();
export default messageDao;
