import TicketDTO from "../dao/DTOs/ticketDto.js";
import TicketDao from "../dao/ticketDao.js";
import { userModel } from "../models/userModel.js";

export default class TicketRepository {
  constructor() {
    this.ticketDao = new TicketDao();
  }

  async getAllTickets() {
    try {
      return await this.ticketDao.getAll();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching tickets from repository");
    }
  }

  async getTicketById(tid) {
    try {
      const result = await this.ticketDao.getById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching ticket from repository");
    }
  }

  async createTicket(ticketData) {
    try {
      const code = await this.generateTicketCode();
      return await this.ticketDao.create({ ...ticketData, code });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating ticket in repository");
    }
  }

  async generateTicketCode() {
    try {
      return await this.ticketDao.generateCode();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error generating random code");
    }
  }
}