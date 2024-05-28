import { cartModel } from "../models/cartModel.js";

class CartDao {
  async getAllCarts() {
    return await cartModel.find();
  }

  async createCart() {
    return await cartModel.create({ products: [] });
  }

  async getCartById(cid) {
    return await cartModel.findById(cid).populate("products.product").lean();
  }

  async addProductToCart(cartid, productId, quantity = 1) {
    const cart = await cartModel.findOne({ _id: cartid });
    if (!cart) throw new Error(`Cart with ID ${cartid} not found`);

    const existingProduct = cart.products.find((product) =>
      product.product.equals(productId)
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await cartModel.updateOne(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } }
    );
  }

  async deleteCart(id) {
    return await cartModel.deleteOne({ _id: id });
  }

  async deleteAllProductsFromCart(cartId) {
    return await cartModel.findByIdAndUpdate(cartId, { products: [] });
  }

  async deleteProductFromCart(cartId, productId) {
    return await cartModel.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: productId } } }
    );
  }
}

const cartDao = new CartDao();

export default cartDao;
