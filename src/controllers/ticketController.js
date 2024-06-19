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

  async createTicket(req, res) {
    const { purchaser, cart, products } = req.body;
    if (!cart || !purchaser || !products) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const resultUser = await this.userService.findUserById(purchaser);
      const purchaserEmail = resultUser.email;

      const code = await this.generateUniqueCode();
      const purchase_datetime = Date.now();

      let totalAmount = 0;
      const updatedProducts = [];

      for (const item of products) {
        const product = await this.productService.getProductById(item.product);

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Not enough stock for product ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`,
          });
        }

        const updatedProduct = await this.productService.updateProduct(
          product._id,
          { stock: product.stock - item.quantity }
        );

        totalAmount += product.price * item.quantity;

        updatedProducts.push({
          product: product._id,
          quantity: item.quantity,
          updatedStock: updatedProduct.stock,
        });
      }

      const newTicket = {
        code,
        purchase_datetime,
        amount: totalAmount,
        purchaser: purchaserEmail,
        products: updatedProducts,
      };

      const result = await this.ticketService.createTicket(newTicket);

      await this.cartService.updateCartWithTicket(cart, result._id);

      res.json({
        ticket: result,
        updatedProducts,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Error creating ticket" });
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