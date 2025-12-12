import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  createProduct,
  createProductRams,
  createProductSize,
  createProductWeight,
  deleteMultipleProduct,
  deleteMultipleProductRams,
  deleteMultipleProductSize,
  deleteMultipleProductWeight,
  deleteProduct,
  deleteProductRams,
  deleteProductSize,
  deleteProductWeight,
  filters,
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
  getProductRams,
  getProductRamsById,
  getProductsCount,
  getProductSize,
  getProductSizeById,
  getProductWeight,
  getProductWeightById,  
  removeImageFromCloudinary,  
  shortBy,  
  updateProduct,
  updateProductRams,
  updateProductSize,
  updateProductWeight,
  uploadBannerImages,
  uploadImages,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
productRouter.post("/uploadBannerImages", auth, upload.array("bannerimages"), uploadBannerImages);
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

// product Rams
productRouter.post("/productRAMS/create", auth, createProductRams);
productRouter.delete("/productRAMS/:id", auth, deleteProductRams);
productRouter.put("/productRAMS/:id", auth, updateProductRams);
productRouter.delete("/productRAMS/deleteMultipleRams", deleteMultipleProductRams)
productRouter.get("/productRAMS/ramlist", getProductRams)
productRouter.get("/productRAMS/:id",getProductRamsById);


// product Weight
productRouter.post("/productWeight/create", auth, createProductWeight);
productRouter.delete("/productWeight/:id", auth, deleteProductWeight);
productRouter.put("/productWeight/:id", auth, updateProductWeight);
productRouter.delete("/productWeight/deleteMultipleWeight", deleteMultipleProductWeight)
productRouter.get("/productWeight/Weightlist", getProductWeight)
productRouter.get("/productWeight/:id",getProductWeightById);


// product Size
productRouter.post("/productSize/create", auth, createProductSize);
productRouter.delete("/productSize/:id", auth, deleteProductSize);
productRouter.put("/productSize/:id", auth, updateProductSize);
productRouter.delete("/productSize/deleteMultipleSize", deleteMultipleProductSize)
productRouter.get("/productSize/Sizelist", getProductSize)
productRouter.get("/productSize/:id",getProductSizeById);


productRouter.post("/filters",filters);
productRouter.post("/shortBy",shortBy);

export default productRouter;
