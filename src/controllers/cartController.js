import CartService from "../services/cartService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
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
}

export default CartController;