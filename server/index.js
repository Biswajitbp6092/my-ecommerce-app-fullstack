import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDb from "./config/connectDb.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import homeSlideRouter from "./route/homeSlide.route.js";
import bannerV1Router from "./route/bannerV1.route.js";


const app = express();
app.use(cors());


app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));

app.get("/", (request, respons) => {
  respons.json({ message: "Server is ranning from " + process.env.PORT });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/mylist", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/homeSlides", homeSlideRouter);
app.use("/api/bannerV1", bannerV1Router);


connectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
