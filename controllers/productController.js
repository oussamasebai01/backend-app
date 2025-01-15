import produits from "../models/produits.js";
import { upload } from "../middlewares/upload.js";
import path from "path";
import fs from "fs";
import * as url from "url";

// +++++++++++++++++ BY_THE_CONNECTED_USER ++++++++++++++++++++++++++++++++++++++
let __dirname = url.fileURLToPath(new URL(".", import.meta.url));
//add_product by the connected user
export const addProduct = async (req, res) => {
  const Produit = new produits({ ...req.body, user: req.user._id });
  console.log(Produit);
  await Produit.save()
    .then(() => {
      console.log(req.body);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

// Add product with image upload
export const addProductWithImage = async (req, res) => {
  try {
    // Create a new product instance
    const newProduct = new produits({
      nom_produit: req.body.nom_produit,
      categorie_produit: req.body.categorie_produit,
      etat: req.body.etat,
      Marque: req.body.Marque,
      Prix: req.body.Prix,
      Description: req.body.Description,
      user: req.user._id, // Assuming req.user._id contains the user ID
      image_name: req.body.image_name,
    });

    // Save the product to database
    await newProduct.save();
  } catch (error) {
    console.error("Error adding product:", error);
    return res.sendStatus(500);
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    // Handle file upload using multer

    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.sendStatus(500);
      }

      if (req.file) {
        const fileName = req.file.filename;
        const filePath = path.join(__dirname, "./public/uploads/", fileName);
      }

      return res.sendStatus(200);
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.sendStatus(500);
  }
};

//get all the products of the connected user
export const getallProductsByUser = async (req, res) => {
  try {
    const userProducts = await produits.find({ user: req.user._id });
    res.status(200).json({ array: userProducts });
    console.log(userProducts);
  } catch (error) {
    console.error("Error fetching user products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};

//delete products by user
export const deleteProductByUSer = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  try {
    // Find the product by ID
    const product = await produits.findById(productId);

    // Check if the product exists and belongs to the authenticated user
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this product" });
    }

    // Delete the product
    await produits.findByIdAndDelete(productId);
    res.sendStatus(200);
    console.log(`Product ${productId} deleted by user ${userId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.sendStatus(500);
  }
};
//update product by user
export const updateProductByUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const product = await produits.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this product" });
    }

    await produits.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the product" });
  }
};

// Count the total number of products for the current user
export const TotalProducts = async (req, res) => {
  try {
    const totalProducts = await produits.countDocuments({ user: req.user._id });
    res.status(200).json({ total: totalProducts });
    console.log(totalProducts);
  } catch (error) {
    console.error("Error counting total products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while counting total products" });
  }
};

// Count the number of products with status 'en_stock'
export const countInStockProducts = async (req, res) => {
  try {
    const inStockCount = await produits.countDocuments({
      user: req.user._id,
      etat: "en_stock",
    });
    res.status(200).json({ inStock: inStockCount });
    console.log(inStockCount);
  } catch (error) {
    console.error("Error counting in-stock products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while counting in-stock products" });
  }
};

// Count the number of products with status 'hors_stock'
export const countOutOfStock = async (req, res) => {
  try {
    const outOfStockCount = await produits.countDocuments({ user: req.user._id, etat: 'hors_stock' });
    res.status(200).json({ outOfStock: outOfStockCount });
  } catch (error) {
    console.error("Error counting out-of-stock products:", error);
    res.status(500).json({ error: "An error occurred while counting out-of-stock products" });
  }
};


// Count total prices of in-stock products
export const countInStockPrices = async (req, res) => {
  try {
    const result = await produits.aggregate([
      { $match: { etat: 'en_stock' } },
      { $group: { _id: null, totalPrice: { $sum: '$Prix' } } }
    ]);
    const totalPrice = result.length > 0 ? result[0].totalPrice : 0;
    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error("Error fetching in-stock prices:", error);
    res.status(500).json({ message: "An error occurred while fetching in-stock prices" });
  }
};

// Count total prices of out-of-stock products
export const countOutOfStockPrices = async (req, res) => {
  try {
    const result = await produits.aggregate([
      { $match: { etat: 'hors_stock' } },
      { $group: { _id: null, totalPrice: { $sum: '$Prix' } } }
    ]);
    const totalPrice = result.length > 0 ? result[0].totalPrice : 0;
    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error("Error fetching out-of-stock prices:", error);
    res.status(500).json({ message: "An error occurred while fetching out-of-stock prices" });
  }
};

// Count total prices of all products
export const countAllPrices = async (req, res) => {
  try {
    const result = await produits.aggregate([
      { $group: { _id: null, totalPrice: { $sum: '$Prix' } } }
    ]);
    const totalPrice = result.length > 0 ? result[0].totalPrice : 0;
    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error("Error fetching total prices:", error);
    res.status(500).json({ message: "An error occurred while fetching total prices" });
  }
};
// +++++++++++++++++ BY_THE_ADMIN ++++++++++++++++++++++++++++++++++++++

//get all products by the admin
export const getallProducts = async (req, res) => {
  await produits
    .find()
    .then((result) => {
      res.send({ array: result });
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};
//delete products by the admin
export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  await produits
    .findByIdAndDelete(id)
    .then((result) => {
      res.sendStatus(200);
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};
//update products by the admin
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  await produits
    .findByIdAndUpdate(id, req.body)
    .then((result) => {
      res.status(200).send({ message: "Product updated successfully!" });
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};
