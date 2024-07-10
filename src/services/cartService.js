import CartRepository from "../repository/cartRepository.js";
import TicketRepository from "../repository/ticketRepository.js";
import ProductRepository from "../repository/productRepository.js";

export default class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.ticketRepository = new TicketRepository();
    this.productRepository = new ProductRepository();
  }

  async getAllCarts() {
    return await this.cartRepository.getAllCarts();
  }

  async createCart() {
    return await this.cartRepository.createCart();
  }

  async getProductsFromCartByID(cid) {
    return await this.cartRepository.getProductsFromCartByID(cid);
  }

  async addProductToCart(cartid, productId, quantity) {
    console.log(
      "CartService.addProductToCart - cartid:",
      cartid,
      "productId:",
      productId,
      "quantity:",
      quantity
    );
    return await this.cartRepository.addProductToCart(
      cartid,
      productId,
      quantity
    );
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.cartRepository.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
  }

  async deleteCart(id) {
    return await this.cartRepository.deleteCart(id);
  }

  async deleteAllProductsFromCart(cartId) {
    return await this.cartRepository.deleteAllProductsFromCart(cartId);
  }

  async deleteProductFromCart(cartId, productId) {
    return await this.cartRepository.deleteProductFromCart(cartId, productId);
  }

  async getStockFromProducts(cid) {
    return await this.cartRepository.getStockFromProducts(cid);
  }

  async purchaseCart(cartId) {
    try {
      const cart = await this.cartRepository.getProductsFromCartByID(cartId);

      // Check and update each product's stock
      const notProcessed = [];
      for (const cartProduct of cart.products) {
        const productId = cartProduct.product._id;
        const quantityToPurchase = cartProduct.quantity;

        // Fetch the product
        const product = await Product.findById(productId);

        // Check if the product exists and has sufficient stock
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        if (product.stock >= quantityToPurchase) {
          // Deduct the purchased quantity from the product stock
          product.stock -= quantityToPurchase;
          await product.save();
        } else {
          // Add to notProcessed list if there's insufficient stock
          notProcessed.push({
            product: productId,
            quantity: quantityToPurchase,
          });
        }
      }

      // Return products that couldn't be processed due to insufficient stock
      return notProcessed;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error purchasing cart");
    }
  }

  async updateCartWithTicket(cartId, ticketId) {
    try {
      const cart = await this.cartRepository.getProductsFromCartByID(cartId);
      cart.ticket = ticketId;
      await cart.save();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating cart with ticket");
    }
  }
}