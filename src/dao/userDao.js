import { userModel } from "../models/userModel.js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { transport } from "../utils/mailUtil.js";
import moment from "moment-timezone";

dotenv.config();

const secretKey = process.env.SECRET_KEY;

export default class UserDao {
  async getAll() {
    return await userModel
      .find({})
      .populate("cart")
      .populate("cart.products.product")
      .lean();
  }

  async create(user) {
    return await userModel.create(user);
  }

  async findByEmail(email) {
    return await userModel.findOne({ email }).lean();
  }

  async update(userId, updateData) {
    return await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .lean();
  }

  async findById(userId) {
    return await userModel.findById(userId).lean();
  }

  async updatePassword(userId, newPassword) {
    return await userModel.findByIdAndUpdate(userId, { password: newPassword });
  }

  async getUserByToken(token) {
    //ask if I should use passport here
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    return await userModel.findOne({ email }).lean();
  }

  async updateRole(userId, newRole) {
    return await userModel.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );
  }

  async updateUserDocuments(userId, documents) {
    return await userModel.findByIdAndUpdate(
      userId,
      { $push: { documents: { $each: documents } } },
      { new: true }
    );
  }

  async deleteByEmail(userId) {
    return await userModel.findOneAndDelete(userId).lean();
  }

  async deleteUsers() {
    try {
      const timeZone = moment.tz("America/Argentina/Buenos_Aires");
      const utcOffset = timeZone.utcOffset();
      const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000);
      const twoDaysAgo = new Date(
        lastConnection.getTime() - 2 * 24 * 60 * 60 * 1000
      );

      const inactiveUsers = await userModel.find({
        last_connection: { $lte: twoDaysAgo },
      });
      const result = await userModel.deleteMany({
        last_connection: { $lte: twoDaysAgo },
      });

      // Send emails to inactive users
      for (const user of inactiveUsers) {
        const mailOptions = {
          from: "Juan Manuel <jmgaleman@gmail.com>",
          to: user.email,
          subject: "Account closed due to Inactivity",
          html: `<div style="font-family: 'Montserrat', sans-serif; color: black;">
                    <h1>Your account has been closed due to inactivity.</h1>
                     <p>We have received a request to delete inactive accounts.</p>
                    <p>To create a new account click:</p>
                    <button href="https://desafiocomplementario-backend.onrender.com/register" class="button">New Account</button>
                     </div>`,
        };

        await new Promise((resolve, reject) => {
          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              return reject(error);
            }
            resolve(info);
          });
        });
      }

      return {
        status: "success",
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      throw new Error("Error deleting users!");
    }
  }
}