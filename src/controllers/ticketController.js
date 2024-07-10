import TicketService from "../services/ticketService.js";
import UserService from "../services/userService.js";
import CartService from "../services/cartService.js";
import ProductService from "../services/productService.js";

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
    this.userService = new UserService();
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  async getAllTickets(req, res) {
    const { limit, page, query, sort } = req.query;
    try {
      const tickets = await this.ticketService.getAllTickets(
        limit,
        page,
        query,
        sort
      );
      res.json(tickets);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Error fetching tickets" });
    }
  }

  async getTicketById(req, res) {
    const { tid } = req.params;
    try {
      const result = await this.ticketService.getTicketById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      res.json(result);
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async createTicket(purchaser, amount, processed) {
    console.log(purchaser);
    try {
      const purchase_datetime = Date.now();

      // Create new ticket
      const newTicket = {
        purchase_datetime,
        products: processed,
        amount: amount,
        purchaser: purchaser,
      };

      const result = await this.ticketService.createTicket(newTicket);

      return {
        ticket: result,
      };
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async generateUniqueCode() {
    try {
      const randomCode = Math.floor(Math.random() * 1000) + 1;
      return randomCode;
    } catch (error) {
      console.log(error.message);
      throw new Error("Error generating random code");
    }
  }
}

export default TicketController;