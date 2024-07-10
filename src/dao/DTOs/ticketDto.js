export default class ticketDTO {
  constructor(ticket) {
    this._id = ticket._id;
    this.code = ticket.code;
    this.products = ticket.products;
    this.purchaseDateTime = ticket.purchaseDateTime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
  }
}