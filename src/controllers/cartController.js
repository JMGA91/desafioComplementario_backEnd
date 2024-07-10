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
      const processed = [];

      // Step 2: Process each product
      for (const cartProduct of cart.products) {
        if (!cartProduct.product) {
          console.error(`Invalid product in cart: ${cartProduct}`);
          continue;
        }

        const product = await productModel.findById(cartProduct.product._id);
        if (product.stock >= cartProduct.quantity) {
          // Deduct the quantity from the product's stock
          product.stock -= cartProduct.quantity;
          await product.save();
          processed.push(cartProduct);
          console.log("Product procesado", cartProduct);
        } else {
          // If there's not enough stock, add to notProcessed
          console.log("Producto no procesado", cartProduct);
          const remainingQuantity = cartProduct.quantity - product.stock;
          if (remainingQuantity > 0) {
            notProcessed.push({
              product: cartProduct.product.id,
              quantity: remainingQuantity,
            });
            await this.updateProductQuantity(
              cartId,
              product._id,
              remainingQuantity
            );
            processed.push({
              product: cartProduct.product.id,
              quantity: product.stock,
            });
            product.stock = 0;
            await product.save();
          }
        }
      }

      return {
        processed,
        notProcessed,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error purchasing cart");
    }
  }
}

export default CartController;