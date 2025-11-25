import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  createProduct,
  deleteMultipleProduct,
  deleteProduct,
  getAllFeaturedProduct,
  getAllProduct,
  getAllProductByCatId,
  getAllProductByCatName,
  getAllProductByPrice,
  getAllProductByRating,
  getAllProductBySubCatId,
  getAllProductBySubCatName,
  getAllProductByThirdLavelCatId,
  getAllProductByThirdLavelCatName,
  getProduct,
  getProductsCount,
  removeImageFromCloudinary,
  updateProduct,
  uploadImages,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
productRouter.post("/create", auth, createProduct);
productRouter.get("/getAllProducts", getAllProduct);
productRouter.get("/getAllProductByCatId/:id", getAllProductByCatId);
productRouter.get("/getAllProductByCatName", getAllProductByCatName);
productRouter.get("/getAllProductBySubCatId/:id", getAllProductBySubCatId);
productRouter.get("/getAllProductByCatName", getAllProductBySubCatName);
productRouter.get("/getAllProductByThirdLavelCat/:id",getAllProductByThirdLavelCatId);
productRouter.get("/getAllProductByThirdLavelCatName",getAllProductByThirdLavelCatName);
productRouter.get("/getAllProductByPrice",getAllProductByPrice);
productRouter.get("/getAllProductByRating",getAllProductByRating);
productRouter.get("/getAllProductCount",getProductsCount);
productRouter.get("/getAllFeaturedProduct",getAllFeaturedProduct);
productRouter.delete("/:id",deleteProduct);
productRouter.delete("/deleteMultiple", deleteMultipleProduct)
productRouter.get("/:id",getProduct);
productRouter.delete("/deleteimage", auth, removeImageFromCloudinary);
productRouter.put("/updateProducts/:id", auth, updateProduct);

export default productRouter;
