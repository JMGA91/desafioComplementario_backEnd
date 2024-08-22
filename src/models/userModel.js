import mongoose from "mongoose";
import { createHash } from "../utils/functionUtil.js";
import Cart from "./cartModel.js"; // Import the Cart model

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    require: true,
    min: 18,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "premium", "admin"],
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: {
    type: Date,
  },
});

// Pre-save hook to create a cart if it doesn't exist
usersSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Create a new cart and associate it with the user
      const newCart = await Cart.create({
        /* Default cart values */
      });
      this.cart = newCart._id;
    } catch (error) {
      return next(error);
    }
  }

  // Hash password if it's being modified
  if (this.isModified("password")) {
    if (this.password) {
      this.password = createHash(this.password);
    } else {
      return next(new Error("Password is required"));
    }
  }

  next();
});

export const userModel = mongoose.model(usersCollection, usersSchema);