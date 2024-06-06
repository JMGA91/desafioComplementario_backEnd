import ticketRepository from "../repository/ticketRepository.js";

class TicketController {
  async getAllTickets(req, res) {
    const { limit, page, query, sort } = req.query;
    try {
      const result = await ticketRepository.getAllTickets(
        limit,
        page,
        query,
        sort
      );
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error fetching tickets" });
    }
  }

  async getTicketById(req, res) {
    const { tid } = req.params;
    try {
      const result = await ticketRepository.getTicketById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createTicket(req, res) {
    try {
      const { purchaseDateTime, amount, purchaser } = req.body;
      const ticketData = { purchaseDateTime, amount, purchaser };
      const newTicket = await ticketRepository.createTicket(ticketData);
      res.send({ status: "success", payload: newTicket });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ status: "error", message: error.message });
    }
  }
}

export default TicketController;