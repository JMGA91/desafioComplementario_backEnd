import Cart from "../models/cartModel.js";

class CartDao {
  async getAllCarts() {
    return await Cart.find();
  }

  async createCart() {
    return await Cart.create({ products: [] });
  }

  async getCartById(cid) {
    return await Cart.findById(cid).populate("products.product").lean();
  }

  async addProductToCart(cartid, productId, quantity) {
    const cart = await Cart.findOne({ _id: cartid });
    if (!cart) throw new Error(`Cart with ID ${cartid} not found`);

    const existingProduct = cart.products.find(
      (product) => product.product.toString() === productId
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
    return await Cart.updateOne(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } }
    );
  }

  async deleteCart(id) {
    return await Cart.deleteOne({ _id: id });
  }

  async deleteAllProductsFromCart(cartId) {
    return await Cart.findByIdAndUpdate(cartId, { products: [] });
  }

  async deleteProductFromCart(cartId, productId) {
    return await Cart.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: productId } } }
    );
  }
}

const cartDao = new CartDao();
export default cartDao;