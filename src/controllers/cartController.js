import cartRepository from "../repository/cartRepository.js";

class CartController {
  async getAllCarts() {
    try {
      return await cartRepository.getAllCarts();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching carts");
    }
  }

  async createCart() {
    try {
      return await cartRepository.createCart({ products: [] });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getProductsFromCartByID(cartId) {
    try {
      return await cartRepository.getProductsFromCart(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Products not found in cart ${cartId}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      return await cartRepository.addProductToCart(cartId, productId, quantity);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error adding product to cart");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return await cartRepository.updateProductQuantity(
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
      return await cartRepository.deleteCart(id);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting cart");
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      return await cartRepository.deleteAllProductsFromCart(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting all products from cart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await cartRepository.deleteProductFromCart(cartId, productId);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting product from cart");
    }
  }

  async getStockfromProducts(cart) {
    return await cartRepository.getStockfromProducts(cart);
  }
}

const cartController = new CartController();

export default cartController;