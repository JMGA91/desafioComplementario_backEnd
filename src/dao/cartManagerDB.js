import { cartModel } from "./models/cartModel.js";

class cartManagerDB {
  async getAllCarts() {
    try {
      return await cartModel.find();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching carts");
    }
  }

  async createCart() {
    try {
      const newCart = await cartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getProductsFromCartByID(cid) {
    try {
      const cart = await cartModel
        .findById(cid)
        .populate("products.product")
        .lean();
      if (!cart) throw new Error(`Cart with ID ${cid} not found`);
      return cart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching cart products");
    }
  }

  async addProductToCart(cartid, productId, quantity = 1) {
    try {
      const cart = await cartModel.findOne({ _id: cartid });
      if (!cart) throw new Error(`Cart with ID ${cartid} not found`);

      const existingProduct = cart.products.find(
        (product) => product.product === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error adding product to cart");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return await cartModel.updateOne(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } }
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product quantity");
    }
  }

  async deleteCart(id) {
    try {
      return await cartModel.deleteOne({ _id: id });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting cart");
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      return await cartModel.findByIdAndUpdate(cartId, { products: [] });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting all products from cart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } }
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting product from cart");
    }
  }
}

export default cartManagerDB;
