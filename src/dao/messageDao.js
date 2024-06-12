import MessageModel from "../models/messageModel.js";

export default class MessageDao {
  async getAll() {
    return await MessageModel.find().lean();
  }

  async insert(user, message) {
    return await MessageModel.create({ user, message });
  }
}