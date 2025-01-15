tests/productController.test.js
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import connectDB from "../db/cnx.js";
import {
  addProduct,
  getallProductsByUser,
  deleteProductByUSer,
  updateProductByUser,
  TotalProducts,
  countInStockProducts,
  countOutOfStock,
  countInStockPrices,
  countOutOfStockPrices,
  countAllPrices,
  getallProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import produits from "../models/produits.js";

// Initialize express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock authentication middleware
app.use("/api", (req, res, next) => {
  req.headers.authorization = "Bearer mocktoken";
  next();
});

// Define routes
app.post("/api/add_product", addProduct);
app.get("/api/get_product", getallProductsByUser);
app.delete("/api/del_product_user/:id", deleteProductByUSer);
app.put("/api/update_product_user/:id", updateProductByUser);
app.get("/api/total_products", TotalProducts);
app.get("/api/count_instoc", countInStockProducts);
app.get("/api/count_offstoc", countOutOfStock);
app.get("/api/instock_prices", countInStockPrices);
app.get("/api/offstock_prices", countOutOfStockPrices);
app.get("/api/all_prices", countAllPrices);
app.get("/api/all_products", getallProducts);
app.delete("/api/del_product/:id", deleteProduct);
app.put("/api/update_product/:id", updateProduct);

// Connect to DB before running tests
beforeAll(async () => {
  await connectDB();
});

// Close DB connection after tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test suite
describe("Product Controller", () => {
  test("should add a new product", async () => {
    const newProduct = {
      nom_produit: "Test Product",
      categorie_produit: "informatique",
      etat: "en_stock",
      Marque: "Test Brand",
      Prix: 100,
      Description: "Test Description",
    };

    const response = await request(app)
      .post("/api/add_product")
      .send(newProduct);

    expect(response.status).toBe(200);
  });

  test("should get all products for the user", async () => {
    const response = await request(app).get("/api/get_product");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("array");
  });

  test("should delete a product by user", async () => {
    const product = await produits.create({
      nom_produit: "Product to Delete",
      categorie_produit: "informatique",
      etat: "en_stock",
      Marque: "Test Brand",
      Prix: 100,
      Description: "Test Description",
      user: mongoose.Types.ObjectId(),
    });

    const response = await request(app).delete(
      `/api/del_product_user/${product._id}`
    );

    expect(response.status).toBe(200);
  });

  test("should update a product by user", async () => {
    const product = await produits.create({
      nom_produit: "Product to Update",
      categorie_produit: "informatique",
      etat: "en_stock",
      Marque: "Test Brand",
      Prix: 100,
      Description: "Test Description",
      user: mongoose.Types.ObjectId(),
    });

    const updatedProduct = {
      nom_produit: "Updated Product",
      categorie_produit: "bureatique",
      etat: "hors_stock",
      Marque: "Updated Brand",
      Prix: 200,
      Description: "Updated Description",
    };

    const response = await request(app)
      .put(`/api/update_product_user/${product._id}`)
      .send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Product updated successfully!"
    );
  });
});
