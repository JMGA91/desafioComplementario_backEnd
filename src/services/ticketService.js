import TicketRepository from "../repository/ticketRepository.js";

export default class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  async getAllTickets(limit, page, query, sort) {
    return await this.ticketRepository.getAllTickets(limit, page, query, sort);
  }

  async getTicketById(tid) {
    return await this.ticketRepository.getTicketById(tid);
  }

  async getTicketsByUserId(userId) {
    return await this.ticketRepository.getTicketsByUserId(userId);
  }

  async createTicket(ticket) {
    return await this.ticketRepository.createTicket(ticket);
  }

  async generateTicketCode() {
    try {
      return await this.ticketRepository.generateTicketCode();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error generating ticket code");
    }
  }
}