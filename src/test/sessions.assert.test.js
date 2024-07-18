//Assert testing
import Assert from "assert";
import mongoose from "mongoose";
import UserDao from "../dao/userDao.js";
import * as dotenv from "dotenv";
//mocha --watch --parallel src/test/sessions.assert.test.js

dotenv.config();

const uri = process.env.URI;

mongoose.connect(uri, { dbName: "testing" });
const dao = new UserDao();
const testUser = {
  firstName: "Testing",
  lastName: "flameShop",
  email: "testingshop@gmail.com",
  password: "test123456",
};

describe("Tests DAO Users", function () {
  // Runs before starting the test suite
  before(async function () {
    try {
      await mongoose.connection.collections.users.drop();
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

  it("getAll() should return an array of users", async function () {
    const result = await dao.getAll();
    Assert.strictEqual(Array.isArray(result), true);
  });

  it("create() should save a new user", async function () {
    const result = await dao.create(testUser);
    Assert.strictEqual(typeof result, "object");
    Assert.ok(result._id);
  });

  it("findByEmail() should return an object matching the desired email", async function () {
    const result = await dao.findByEmail(testUser.email);
    Assert.strictEqual(typeof result, "object");
    Assert.ok(result._id);
    Assert.strictEqual(result.email, testUser.email);
    testUser._id = result._id;
  });

  it("update() should return an object with correctly modified data", async function () {
    const modifiedEmail = "newemail@gmail.com";
    const result = await dao.update(testUser._id, { email: modifiedEmail });
    Assert.strictEqual(typeof result, "object");
    Assert.ok(result._id);
    Assert.strictEqual(result.email, modifiedEmail);
  });

  it("delete() should delete the user with the specified email", async function () {
    const result = await dao.deleteByEmail(testUser.modifiedEmail);
    Assert.strictEqual(typeof result, "object");
    Assert.strictEqual(result.modifiedEmail, testUser.modifiedEmail);

    const deletedUser = await dao.findByEmail(testUser.modifiedEmail);
    Assert.strictEqual(deletedUser, null);
  });
});