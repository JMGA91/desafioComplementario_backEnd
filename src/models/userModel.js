import mongoose from "mongoose";
import { createHash } from "../utils/functionUtil.js";

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
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
});

usersSchema.pre("save", function (next) {
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
