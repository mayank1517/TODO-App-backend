import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./Routes/user.route.js";
import cookieParser from "cookie-parser";
import companyRoute from "./Routes/company.route.js";
import connectCloudinary from "./cloudnary.js";

const app = express();
dotenv.config();

connectCloudinary(); // Connect to Cloudinary for image upload

const port = process.env.PORT || 3000;
const uri = process.env.URI || "mongodb://localhost:27017/TODO-App";

app.use(express.json());
app.use(cookieParser());
try {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

app.use("/users", userRoute);
app.use("/companies", companyRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
