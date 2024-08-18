import { expect } from "chai";
import supertest from "supertest";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { fakerES_MX } from "@faker-js/faker";
import { startLogger } from "../utils/loggerUtil.js";
import path from "path";

// Load environment variables
dotenv.config();
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

const generateUsers = () => ({
  user: fakerES_MX.internet.userName(),
  email: fakerES_MX.internet.email(),
  password: fakerES_MX.string.alphanumeric(8),
});

const newUser = generateUsers();
const isUser = { email: "super@test.com", password: "test12345" };

before(async function () {
  this.timeout(10000);
  try {
    await mongoose.connect(uri);
    startLogger("DB connection successful");
  } catch (error) {
    startLogger(`Error during setup: ${error.message}`);
    throw error;
  }
});

describe("Testing users routes", () => {
  it("Login credentials", async () => {
    const response = await requester
      .post("/api/session/login")
      .send(isUser)
      .set("Accept", "application/json");

    expect(response.statusCode).to.equal(302);
  });

  it("POST Register for Users Endpoint", async () => {
    const response = await requester
      .post("/api/session/register")
      .send(newUser)
      .set("Accept", "application/json");

    //console.log("Register Response Status:", response.statusCode); // Debugging log
    //console.log("Register Response Body:", response.body); // Debugging log

    expect(response.statusCode).to.equal(200);
  });
});

after(async () => {
  try {
    await mongoose.disconnect();
    startLogger("DB disconnected");
  } catch (error) {
    console.error("Error during DB disconnect:", error);
  }
});