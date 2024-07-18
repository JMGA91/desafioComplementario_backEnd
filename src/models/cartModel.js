import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, default: 0 },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;