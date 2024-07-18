// Chai testing
import { expect } from "chai";
import mongoose from "mongoose";
import ProductDao from "../dao/productDao.js";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.URI;

mongoose.connect(uri, { dbName: "testingChai" });
const dao = new ProductDao();

const testProduct = {
  title: "Test Product",
  description: "This is a test product",
  code: "TESTING123",
  price: 2500,
  stock: 20,
  category: "Test Category",
};

describe("Tests DAO Products", function () {
  // Runs before starting the test suite
  before(async function () {
    try {
      await mongoose.connection.collections.products.drop();
    } catch (error) {
      console.log("No collection to drop");
    }
  });

  // Runs before each individual test
  beforeEach(function () {
    this.timeout(5000);
  });

  // Runs after the entire test suite
  after(async function () {
    await mongoose.disconnect();
  });

  // Runs after each individual test
  afterEach(function () {});

  it("getAll() should return an array of products", async function () {
    const result = await dao.getAll({}, {});
    expect(result.docs).to.be.an("array");
  });

  it("create() should save a new product", async function () {
    const result = await dao.create(testProduct);

    // Check that the result is an object
    expect(result).to.be.an("object");

    // Check that the result has an ID
    expect(result).to.have.property("_id");

    // Check that the product data matches the input
    expect(result.title).to.equal(testProduct.title);
    expect(result.description).to.equal(testProduct.description);
    expect(result.code).to.equal(testProduct.code);
    expect(result.price).to.equal(testProduct.price);
    expect(result.stock).to.equal(testProduct.stock);
    expect(result.category).to.equal(testProduct.category);
  });

  it("getById() should return an object matching the desired ID", async function () {
    const createdProduct = await dao.create(testProduct);
    const result = await dao.getById(createdProduct._id);
    expect(result).to.be.an("object");
    expect(result).to.have.property("_id");
    expect(result._id.toString()).to.equal(createdProduct._id.toString());
  });

  it("update() should return an object with correctly modified data", async function () {
    const createdProduct = await dao.create(testProduct);
    const modifiedTitle = "Updated Product";
    await dao.update(createdProduct._id, { title: modifiedTitle });
    const updatedProduct = await dao.getById(createdProduct._id);
    expect(updatedProduct.title).to.equal(modifiedTitle);
  });

  it("delete() should delete the product with the specified ID", async function () {
    const createdProduct = await dao.create(testProduct);
    const result = await dao.delete(createdProduct._id);
    expect(result.deletedCount).to.equal(1);

    const deletedProduct = await dao.getById(createdProduct._id);
    expect(deletedProduct).to.be.null;
  });
});