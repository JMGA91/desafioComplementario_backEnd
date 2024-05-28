import cartDao from "../dao/cartDao.js";

class CartService {
  async getAllCarts() {
    return await cartDao.getAllCarts();
  }

  async createCart() {
    return await cartDao.createCart();
  }

  async getProductsFromCartByID(cid) {
    return await cartDao.getCartById(cid);
  }

  async addProductToCart(cartid, productId, quantity) {
    return await cartDao.addProductToCart(cartid, productId, quantity);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await cartDao.updateProductQuantity(cartId, productId, quantity);
  }

  async deleteCart(id) {
    return await cartDao.deleteCart(id);
  }

  async deleteAllProductsFromCart(cartId) {
    return await cartDao.deleteAllProductsFromCart(cartId);
  }

  async deleteProductFromCart(cartId, productId) {
    return await cartDao.deleteProductFromCart(cartId, productId);
  }
}

const cartService = new CartService();
export default cartService;
