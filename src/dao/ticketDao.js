import ticketModel from "../models/ticketModel.js";

export default class TicketDao {
  async getAll() {
    try {
      const tickets = await ticketModel
        .find()
        .populate("purchaser")
        .populate("products.product")
        .lean();
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async getById(ticketId) {
    return await ticketModel.findOne({ _id: ticketId }).lean();
  }

  async geUserById(userId) {
    try {
      const tickets = await ticketModel.find({ userId: userId });
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async create(ticket) {
    try {
      const newTicket = await ticketModel.create(ticket);
      return newTicket;
    } catch (error) {
      throw error;
    }
  }

  async generateCode() {
    try {
      const randomCode = Math.floor(Math.random() * 1000) + 1;
      return randomCode;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error generating random code");
    }
  }
}