// Chai testing
import { expect } from "chai";
import mongoose from "mongoose";
import UserDao from "../dao/userDao.js";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.URI;

mongoose.connect(uri, { dbName: "testingChai" });
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
    expect(result).to.be.an("array");
  });

  it("create() should save a new user", async function () {
    const result = await dao.create(testUser);

    // Check that the result is an object
    expect(result).to.be.an("object");

    // Check that the result has an ID
    expect(result._id).to.be.not.null;

    // Check that the user data matches the input
    expect(result.email).to.equal(testUser.email);
  });

  it("findByEmail() should return an object matching the desired email", async function () {
    const result = await dao.findByEmail(testUser.email);

    testUser._id = result._id;
    expect(result).to.be.an("object");
    expect(result._id).to.be.not.null;
    expect(result.email).to.be.equal(testUser.email);
  });

  it("update() should return an object with correctly modified data", async function () {
    const modifiedEmail = "newemail@gmail.com";
    const result = await dao.update(testUser._id, { email: modifiedEmail });
    expect(result).to.be.an("object");
    expect(result._id).to.be.not.null;
    expect(result.email).to.be.equal(modifiedEmail);
  });

  it("delete() should delete the user with the specified email", async function () {
    const result = await dao.deleteByEmail(testUser.modifiedEmail);
    expect(result).to.be.an("object");
    expect(result._id).to.be.not.null;
  });
});