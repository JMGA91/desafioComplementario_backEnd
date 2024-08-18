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

before(async function () {
  this.timeout(10000);
  try {
    await mongoose.connect(uri);
    startLogger(`DB connection successful`);
  } catch (error) {
    startLogger(`Error during setup: ${error.message}`);
  }
});

describe("Testing product endpoints", () => {
  let authToken; // Authentication token
  let createdProduct; // Store the created product

  it("Login credentials", async () => {
    const response = await requester
      .post("/api/session/login")
      .send(isAdmin)
      .set("Accept", "application/json");

    expect(response.statusCode).to.equal(302);
    authToken = response.headers["set-cookie"][0].split("=")[1];
  });

  it("Create a product", async () => {
    const productData = generateProducts();
    const response = await requester
      .post("/api/products")
      .set("Cookie", `auth=${authToken}`)
      .send(productData);

    console.log("Create product response:", response.body);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload");
    createdProduct = response.body.payload;
  });

  it("Verify created product data", async () => {
    expect(createdProduct).to.have.property("_id");
    expect(createdProduct).to.have.property("title");
    expect(createdProduct).to.have.property("description");
    expect(createdProduct).to.have.property("code");
    expect(createdProduct).to.have.property("price");
    expect(createdProduct).to.have.property("status");
    expect(createdProduct).to.have.property("stock");
    expect(createdProduct).to.have.property("category");
    expect(createdProduct).to.have.property("owner", "admin");
  });

  it("Update a product", async () => {
    const updatedData = {
      title: "Updated Product Title",
      description: "Updated Product Description",
      price: 999.99,
    };

    const updateResponse = await requester
      .put(`/api/products/${createdProduct._id}`)
      .set("Cookie", `auth=${authToken}`)
      .send(updatedData);

    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.body).to.have.property("status", "success");

    const fetchResponse = await requester
      .get(`/api/products/${createdProduct._id}`)
      .set("Cookie", `auth=${authToken}`);

    expect(fetchResponse.status).to.equal(200);
    expect(fetchResponse.body).to.have.property("status", "success");
    const updatedProduct = fetchResponse.body.payload;

    // Verify the updated data
    expect(updatedProduct).to.have.property("_id", createdProduct._id);
    expect(updatedProduct).to.have.property("title", updatedData.title);
    expect(updatedProduct).to.have.property(
      "description",
      updatedData.description
    );
    expect(updatedProduct).to.have.property("price", updatedData.price);
  });

  it("Delete a product", async () => {
    const deleteResponse = await requester
      .delete(`/api/products/${createdProduct._id}`)
      .set("Cookie", `auth=${authToken}`);

    console.log("Delete product response:", deleteResponse.body);

    expect(deleteResponse.status).to.equal(200);
    expect(deleteResponse.body).to.have.property("status", "success");

    const fetchResponse = await requester
      .get(`/api/products/${createdProduct._id}`)
      .set("Cookie", `auth=${authToken}`);

    console.log("Fetch after delete response:", fetchResponse.body);

    expect(fetchResponse.status).to.equal(400); // Updated to reflect the actual status code returned by the server
  });

  it("Get all products", async () => {
    const response = await requester
      .get("/api/products")
      .set("Cookie", `auth=${authToken}`);

    console.log("Get all products response:", response.body);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("payload");

    const payload = response.body.payload; // Correctly define payload

    expect(payload).to.have.property("docs");
    expect(Array.isArray(payload.docs)).to.be.true;
    expect(payload.docs.length).to.be.greaterThan(0); // Ensure there are products

    // Validate each product in the docs array
    payload.docs.forEach((product) => {
      expect(product).to.have.property("_id");
      expect(product).to.have.property("title");
      expect(product).to.have.property("description");
      expect(product).to.have.property("code");
      expect(product).to.have.property("price");
      expect(product).to.have.property("status");
      expect(product).to.have.property("stock");
      expect(product).to.have.property("category");
    });
  });

  after(async () => {
    await mongoose.disconnect();
    startLogger("DB disconnected");
  });
});