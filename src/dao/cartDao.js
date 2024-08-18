import Cart from "../models/cartModel.js";

export default class CartDao {
  async getAll() {
    return await Cart.find();
  }

  async create() {
    return await Cart.create({ products: [] });
  }

  async getById(cid) {
    console.log(`Fetching cart with ID: ${cid}`);

    try {
      const cart = await Cart.findById(cid).populate("products.product").lean();

      console.log("Fetched cart:", cart);

      if (!cart) {
        console.warn(`Cart with ID ${cid} not found`);
      }

      return cart;
    } catch (error) {
      console.error("Error fetching cart by ID:", error);
      throw new Error(`Error fetching cart with ID ${cid}`);
    }
  }

  async addCart(cartId, productId, quantity) {
    console.log(
      "CartDao.addCart - cartId:",
      cartId,
      "productId:",
      productId,
      "quantity:",
      quantity
    );

    if (!productId || !quantity) {
      console.error("Invalid productId or quantity");
      throw new Error("Invalid productId or quantity");
    }

    const cart = await Cart.findOne({ _id: cartId });
    if (!cart) {
      console.error(`Cart with ID ${cartId} not found`);
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    const existingProduct = cart.products.find((product) => {
      return (
        product.product && product.product.toString() === productId.toString()
      );
    });

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity: quantity });
    }

    await cart.save();

    console.log("Updated cart:", cart);
    return cart;
  }

  async updateQuantity(cartId, productId, quantity) {
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
    return updatedCart;
  }

  async delete(id) {
    return await Cart.deleteOne({ _id: id });
  }

  async deleteProducts(cartId) {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
    return cart;
  }

  async deleteProduct(cartId, productId) {
    const cart = await Cart.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: productId } } },
      { new: true }
    );
    return cart;
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
}