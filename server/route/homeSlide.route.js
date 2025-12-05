import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addHomeSlide, deleteMultipleSlide, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, updatedSlide, uploadImages } from "../controllers/homeSlider.controller.js";


const homeSlideRouter = Router();

homeSlideRouter.post("/uploadImages" , auth, upload.array("images"), uploadImages);
homeSlideRouter.post("/add", auth, addHomeSlide);
homeSlideRouter.get("/", getHomeSlides);
homeSlideRouter.get("/:id", getSlide);
homeSlideRouter.delete("/deleteimage", auth, removeImageFromCloudinary);
homeSlideRouter.delete("/:id", auth, deleteSlide);
homeSlideRouter.delete("/deleteMultiple", deleteMultipleSlide);
homeSlideRouter.put("/:id", auth, updatedSlide);

export default homeSlideRouter;
