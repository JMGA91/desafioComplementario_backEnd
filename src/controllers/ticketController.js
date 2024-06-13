import TicketService from "../services/ticketService.js";

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  async getAllTickets(limit, page, query, sort) {
    try {
      await this.ticketService.getAllTickets(limit, page, query, sort);
    } catch (error) {
      console.error(error.message);
    }
  }

  async getTicketById(req, res) {
    const { tid } = req.params;
    try {
      const result = await this.ticketService.getTicketById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      return result;
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createTicket(req, res) {
    try {
      const { purchaseDateTime, amount, purchaser } = req.body;
      const ticketData = { purchaseDateTime, amount, purchaser };
      const newTicket = await this.ticketService.createTicket(ticketData);
      res.send({ status: "success", payload: newTicket });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ status: "error", message: error.message });
    }
  }
}

export default TicketController;