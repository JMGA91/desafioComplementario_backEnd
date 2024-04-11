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

  async getProductsFromCartByID(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error(`Cart with ID ${cid} not found`);
      return cart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching cart products");
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
}

export default cartManagerDB;
