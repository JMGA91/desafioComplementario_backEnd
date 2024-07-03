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

    // Validate existing product quantities
    cart.products = cart.products.map((product) => {
      product.quantity
        ? product.quantity[0]
        : `Invalid quantity for product ${product.product}:`;
      return product;
    });

    const existingProduct = cart.products.find((product) => {
      console.log("Checking product:", product); // Log each product in cart
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
    return cart;
  }

  async updateQuantity(cartId, productId, quantity) {
    return await Cart.updateOne(
      { _id: cartId, "products.product": productId },
      { $set: { "products.quantity": quantity } }
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
}
