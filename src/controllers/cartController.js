import CartService from "../services/cartService.js";
import productModel from "../models/productModel.js";
import TicketController from "./ticketController.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.ticketController = new TicketController();
  }

  async getAllCarts() {
    try {
      return await this.cartService.getAllCarts();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching carts");
    }
  }

  async createCart() {
    try {
      const newCart = await this.cartService.createCart();
      return newCart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getProductsFromCartByID(cartId) {
    try {
      return await this.cartService.getProductsFromCartByID(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Products not found in cart ${cartId}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      return await this.cartService.addProductToCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error adding product to cart");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return await this.cartService.updateProductQuantity(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product quantity");
    }
  }

  async deleteCart(id) {
    try {
      return await this.cartService.deleteCart(id);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting cart");
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      return await this.cartService.deleteAllProductsFromCart(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting all products from cart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await this.cartService.deleteProductFromCart(cartId, productId);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting product from cart");
    }
  }

  async getStockFromProducts(cartId) {
    try {
      return await this.cartService.getStockFromProducts(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Could not get stock from products in cart ${cartId}`);
    }
  }

  async purchaseCart(cartId) {
    try {
      // Step 1: Get the cart and its products
      const cart = await this.cartService.getProductsFromCartByID(cartId);
      const notProcessed = [];
      let amount = 0;

      // Step 2: Process each product
      for (const cartProduct of cart.products) {
        const product = await productModel.findById(cartProduct.product._id);

        if (product.stock >= cartProduct.quantity) {
          // Deduct the quantity from the product's stock
          product.stock -= cartProduct.quantity;
          await product.save();

          // Calculate the total amount
          amount += product.price * cartProduct.quantity;
        } else {
          // If there's not enough stock, add to notProcessed
          notProcessed.push({
            product: cartProduct.product._id,
            quantity: cartProduct.quantity,
          });
        }
      }

      // Step 3: Create the ticket for the purchase
      const ticket = await this.ticketController.createTicket({
        purchaser: req.user.email, // Ensure req.user.email is defined
        cart: cartId,
      });

      // Step 4: Remove processed products from the cart
      await this.cartService.updateCartWithNotProcessed(cartId, notProcessed);

      // Step 5: Send response
      return {
        ticket,
        notProcessed,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error purchasing cart");
    }
  }

  async updateCartWithNotProcessed(cartId, notProcessed) {
    try {
      return await this.cartService.updateCartWithNotProcessed(
        cartId,
        notProcessed
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error updating cart with not processed products");
    }
  }
}

export default CartController;