import cartService from "../services/cartService.js";
import cartDTO from "../dao/DTOs/cartDto.js";

class cartRepository {
  async getAllCarts() {
    try {
      return await cartService.getAllCarts();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching carts");
    }
  }

  async createCart() {
    try {
      const newCartDTO = new cartDTO({ products: [] });
      const newCart = await cartService.createCart(newCartDTO);
      return newCart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getProductsFromCartByID(cid) {
    try {
      const products = await this.dao.getProductsFromCart(cid);
      return new cartDTO(products);
    } catch (error) {
      throw new Error(`Products not found in ${cid}`);
    }
  }

  async addProductToCart(cartid, productId, quantity = 1) {
    try {
      const cart = await cartService.addProductToCart({ _id: cartid });
      if (!cart) throw new Error(`Cart with ID ${cartid} not found`);

      console.log("Cart retrieved:", cart); // Logging the cart

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId.toString()
      );

      console.log("Existing product:", existingProduct);

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
      return await cartService.updateOne(
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
      return await cartService.findByIdAndUpdate(cartId, { products: [] });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting all products from cart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await cartService.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } }
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting product from cart");
    }
  }

  async getStockfromProducts(cid) {
    try {
      const results = await this.dao.getStockfromProducts(cid);
      return new cartDTO(results);
    } catch (error) {
      console.log(error);
      throw new Error(`Could not add products to ${cid}`);
    }
  }
}

export default cartRepository;