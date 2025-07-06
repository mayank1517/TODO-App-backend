import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import todoRoute from "./Routes/todo.route.js";
import userRoute from "./Routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const uri = process.env.URI || "mongodb://localhost:27017/TODO-App";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
try {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

app.use("/users", userRoute);
app.use("/todos", todoRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
