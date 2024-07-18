import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { fakerES_MX } from "@faker-js/faker";
import { startLogger } from "../utils/loggerUtil.js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

const isAdmin = {
  email: "admin@flameshop.com",
  password: "admin12345",
};

export const generateProducts = () => ({
  id: fakerES_MX.string.uuid(),
  title: fakerES_MX.commerce.productName(),
  description: fakerES_MX.commerce.productDescription(),
  code: fakerES_MX.string.alphanumeric(6),
  price: fakerES_MX.commerce.price(),
  status: fakerES_MX.datatype.boolean(0.5),
  stock: fakerES_MX.number.int(100),
  category: fakerES_MX.commerce.productAdjective(),
  thumbnail: fakerES_MX.image.url({ height: 100, width: 100 }),
});

let authToken;

before(async function () {
  this.timeout(10000);
  try {
    await mongoose.connect(uri);
    startLogger(`DB connection successful`);
  } catch (error) {
    startLogger(`Error during setup: ${error.message}`);
  }
});

describe("Testing login endpoint", () => {
  it("Login credentials", async () => {
    const response = await requester
      .post("/api/users/login")
      .send(isAdmin)
      .set("Accept", "application/json");

    if (response.statusCode === 302) {
      const location = response.headers.location;
      const followUpResponse = await requester.get(location);

      expect(followUpResponse.statusCode).to.equal(200);
      authToken = followUpResponse.body.token;
    } else {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property("token");
      authToken = response.body.token;
    }

    console.log("Auth Token:", authToken);
  });
});

it("PUT Operation for Products Endpoint", async () => {
  const updatedProduct = { title: "New Title" };
  const response = await requester
    .put("/api/products/661c83aa9905cc901b886f54")
    .send(updatedProduct)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${authToken}`);

  expect(response.status).to.equal(200);
});

after(async () => {
  await mongoose.disconnect();
  startLogger("DB disconnected");
});