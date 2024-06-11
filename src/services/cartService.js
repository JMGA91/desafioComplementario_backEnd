import cartRepository from "../repository/cartRepository.js";

export default class CartService {
  constructor() {
    this.cartRepository = new cartRepository();
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
}