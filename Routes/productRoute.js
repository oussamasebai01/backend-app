import { Router } from "express";
import { isAuth, userRole } from "../middlewares/isAuth.js";
import {
  addProduct,
  getallProducts,
  deleteProduct,
  updateProduct,
  getallProductsByUser,
  deleteProductByUSer,
  updateProductByUser,
  addProductWithImage,
  uploadProductImage,
  TotalProducts,
  countInStockProducts,
  countOutOfStock,
  countInStockPrices,
  countOutOfStockPrices,
  countAllPrices,
} from "../controllers/productController.js";

const roleRoute = () => {
  const router = Router();
  //////////////////////////////USER//////////////////////////////////////
  /* USER */
  router.post("/add_product", isAuth, addProduct);
  router.get("/get_product", isAuth, getallProductsByUser);
  router.get("/total_products", isAuth, TotalProducts);
  router.get("/count_instoc", isAuth, countInStockProducts);
  router.get("/count_offstoc", isAuth, countOutOfStock);
  router.get("/instock_prices", isAuth, countInStockPrices);
  router.get("/offstock_prices", isAuth, countOutOfStockPrices);
  router.get("/all_prices", isAuth, countAllPrices);
  router.post("/add_product_with_image", isAuth, addProductWithImage);
  router.post("/upload_product_image", isAuth, uploadProductImage);
  router.delete("/del_product_user/:id", isAuth, deleteProductByUSer);
  router.put("/update_product_user/:id", isAuth, updateProductByUser);
  /////////////////////////////Admin//////////////////////////////////////
  router.get("/all_products", userRole("admin"), isAuth, getallProducts);
  router.delete("/del_product/:id", isAuth, userRole("admin"), deleteProduct);
  router.put("/update_product/:id", isAuth, userRole("admin"), updateProduct);
  return router;
};
export default roleRoute;
