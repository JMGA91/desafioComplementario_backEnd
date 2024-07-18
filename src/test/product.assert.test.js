import Assert from "assert";
import mongoose from "mongoose";
import ProductDao from "../dao/productDao.js";
import * as dotenv from "dotenv";
//mocha --watch --parallel src/test/product.assert.test.js
dotenv.config();

const uri = process.env.URI;

mongoose.connect(uri, { dbName: "testing" });
const dao = new ProductDao();
const testProduct = {
  title: "Test Product",
  description: "This is a test product",
  code: "TESTING123",
  price: 1000,
  stock: 50,
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
    this.timeout(1000);
  });

  // Runs after the entire test suite
  after(async function () {
    await mongoose.disconnect();
  });

  // Runs after each individual test
  afterEach(function () {});

  it("getAll() should return an array of products", async function () {
    const result = await dao.getAll({}, {});
    Assert.strictEqual(Array.isArray(result.docs), true);
  });

  it("create() should save a new product", async function () {
    const result = await dao.create(testProduct);
    Assert.strictEqual(typeof result, "object");
    Assert.ok(result._id);
  });

  it("getById() should return an object matching the desired ID", async function () {
    const createdProduct = await dao.create(testProduct);
    const result = await dao.getById(createdProduct._id);
    Assert.strictEqual(typeof result, "object");
    Assert.ok(result._id);
    Assert.strictEqual(result._id.toString(), createdProduct._id.toString());
  });

  it("update() should return an object with correctly modified data", async function () {
    const createdProduct = await dao.create(testProduct);
    const modifiedTitle = "Updated Product";
    await dao.update(createdProduct._id, { title: modifiedTitle });
    const updatedProduct = await dao.getById(createdProduct._id);
    Assert.strictEqual(updatedProduct.title, modifiedTitle);
  });

  it("delete() should delete the product with the specified ID", async function () {
    const createdProduct = await dao.create(testProduct);
    const result = await dao.delete(createdProduct._id);
    Assert.strictEqual(result.deletedCount, 1);

    const deletedProduct = await dao.getById(createdProduct._id);
    Assert.strictEqual(deletedProduct, null);
  });
});