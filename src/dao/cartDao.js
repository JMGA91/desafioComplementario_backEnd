import Cart from "../models/cartModel.js";

export default class CartDao {
  async getAll() {
    return await Cart.find();
  }

  async create() {
    return await Cart.create({ products: [] });
  }

  async getById(cid) {
    return await Cart.findById(cid).populate("products.product").lean();
  }

  async addCart(cartid, productId, quantity) {
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

  async updateQuantity(cartId, productId, quantity) {
    return await Cart.updateOne(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } }
    );
  }

  async delete(id) {
    return await Cart.deleteOne({ _id: id });
  }

  async deleteProducts(cartId) {
    return await Cart.findByIdAndUpdate(cartId, { products: [] });
  }

  async deleteProduct(cartId, productId) {
    return await Cart.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: productId } } }
    );
  }

  async getStockFromProducts(cid) {
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) throw new Error(`Cart with ID ${cid} not found`);

    const stockDetails = cart.products.map((product) => {
      return {
        product: product.product._id,
        stock: product.product.stock,
      };
    });

    return stockDetails;
  }
  async updateCartWithNotProcessed(cartId, notProcessed) {
    try {
      const cart = await CartModel.findById(cartId);

      // Filter out processed products
      cart.products = cart.products.filter((cartProduct) => {
        return notProcessed.some(
          (np) => np.product.toString() === cartProduct.product.toString()
        );
      });

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Error updating cart with not processed products");
    }
  }
}