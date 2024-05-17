import mongoose from "mongoose";
import { createHash } from "../../utils/functionUtil.js";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
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
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "usuario",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
});

usersSchema.pre("save", function () {
  this.password = createHash(this.password);
});

export const userModel = mongoose.model(usersCollection, usersSchema);
