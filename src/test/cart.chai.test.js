// Chai testing
import { expect } from "chai";
import mongoose from "mongoose";
import CartDao from "../dao/cartDao.js";
import Cart from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.URI;
const cartDao = new CartDao();

const testProduct = {
  title: "Test Product",
  description: "Test Description",
  code: "test-code",
  price: 10,
  status: true,
  stock: 100,
  category: "Test Category",
  thumbnails: [],
  owner: "test-owner",
};

describe("Tests DAO Cart", function () {
  // Runs before starting the test suite
  before(async function () {
    await mongoose.connect(uri, { dbName: "testingChai" });
    await Cart.deleteMany({});
    await productModel.deleteMany({});
  });

  // Runs before each individual test
  beforeEach(function () {
    this.timeout(1000);
  });

  // Runs after the entire test suite
  after(async function () {
    await mongoose.connection.close();
  });

  // Runs after each individual test
  afterEach(function () {});

  it("create() should create a new cart", async function () {
    const cart = await cartDao.create();
    expect(cart).to.be.an("object");
    expect(cart._id).to.exist;
    expect(cart.products).to.be.an("array").that.is.empty;
  });

  it("addCart() should add a product to the cart", async function () {
    const product = await productModel.create(testProduct);
    const cart = await cartDao.create();
    const updatedCart = await cartDao.addCart(cart._id, product._id, 2);

    expect(updatedCart.products).to.have.lengthOf(1);
    expect(updatedCart.products[0].product.toString()).to.equal(
      product._id.toString()
    );
    expect(updatedCart.products[0].quantity).to.equal(2);
  });

  it("updateQuantity() should update product quantity in the cart", async function () {
    const product = await productModel.create({
      ...testProduct,
      title: "Another Test Product",
      code: "another-test-code",
      price: 20,
    });
    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const updatedCart = await cartDao.updateQuantity(cart._id, product._id, 5);

    const updatedProduct = updatedCart.products.find(
      (p) => p.product.toString() === product._id.toString()
    );

    expect(updatedProduct.quantity).to.equal(5);
  });

  it("deleteProduct() should delete a product from the cart", async function () {
    const product = await productModel.create({
      ...testProduct,
      title: "Yes its Another Test Product",
      code: "yes-another-test-code",
      price: 15,
    });
    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const updatedCart = await cartDao.deleteProduct(cart._id, product._id);

    expect(updatedCart.products).to.have.lengthOf(0);
  });

  it("getById() should return a cart by ID", async function () {
    const product = await productModel.create({
      ...testProduct,
      title: "Final Test Product",
      code: "final-test-code",
      price: 30,
    });
    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const foundCart = await cartDao.getById(cart._id);

    expect(foundCart).to.be.an("object");
    expect(foundCart._id.toString()).to.equal(cart._id.toString());
  });

  it("deleteProducts() should delete all products from the cart", async function () {
    const product = await productModel.create({
      ...testProduct,
      title: "Another Final Test Product",
      code: "another-final-test-code",
      price: 40,
    });
    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const updatedCart = await cartDao.deleteProducts(cart._id);

    expect(updatedCart.products).to.have.lengthOf(0);
  });
});