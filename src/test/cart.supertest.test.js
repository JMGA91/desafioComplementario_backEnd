import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { startLogger } from "../utils/loggerUtil.js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

before(async function () {
  this.timeout(10000);
  try {
    await mongoose.connect(uri);
    startLogger(`DB connection successful`);
  } catch (error) {
    startLogger(`Error during setup: ${error.message}`);
  }
});

describe("Testing carts routes", () => {
  it("GET Operation for Carts Endpoint", async () => {
    const response = await requester.get("/api/cart");
    expect(response.statusCode).to.be.eql(200);
  });

  it("POST Operation for Carts Endpoint", async () => {
    const response = await requester.post("/api/cart");
    expect(response.statusCode).to.be.eql(200);
  });

  it("DELETE Operation for Carts Endpoint", async () => {
    const response = await requester.delete(
      "/api/cart/661c83aa9905cc901b886f54"
    );
    expect(response.statusCode).to.be.eql(200);
  });
});

after(async () => {
  await mongoose.disconnect();
  startLogger("DB disconnected");
});