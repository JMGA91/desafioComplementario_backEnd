import Assert from "assert";
import mongoose from "mongoose";
import UserDao from "../dao/userDao.js";
import * as dotenv from "dotenv";
dotenv.config();

const uri = process.env.URI;

mongoose.connect(uri, { dbName: "testing" });
const dao = new UserDao();
const assert = Assert.strict;
const testUser = {
  firstName: "Testing",
  lastName: "Flameshop",
  email: "flameshoptest@gmail.com",
  password: "test123456",
};

// This groups all the related tests together
describe("Tests DAO Users", function () {
  // Runs once before all tests start. Use it to set up anything needed for all tests.
  before(function () {});

  // Runs before each individual test. Use it to reset things so each test starts fresh.
  beforeEach(function () {
    this.timeout(3000); // Set timeout to 3 seconds
  });

  // Runs once after all tests finish. Use it to clean up things set up in before.
  after(function () {
    // mongoose.disconnect();
  });

  // Runs after each individual test. Use it to clean up after each test.
  afterEach(function () {});

  // This is a single test.
  it("getAll() should return all users", async function () {
    const result = await dao.getAll();
    assert.strictEqual(Array.isArray(result), true);
    console.log(result);
  });

  it("create() should save my new user", async function () {
    const result = await dao.create(testUser);
    assert.strictEqual(typeof result, "object");
    assert.ok(result._id);
  });
});
