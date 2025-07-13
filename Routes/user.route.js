import express from "express";
import { authenticationMiddleware } from "../Middleware/authorize.js";
import upload from "../multer.js";
import {
  RegisterUser,
  updateResume,
  userLogin,
  userLogout,
} from "../Controller/user.controller.js";
import {
  applyForJob,
  getUserApplicationsForJob,
} from "../Controller/application.controller.js";

const router = express.Router();
router.post("/register", RegisterUser);
router.get("/login", userLogin);
router.get("/logout", userLogout);
router.post("/send-resume", upload.single("resume"), updateResume);
router.post("/send-application/:id", authenticationMiddleware, applyForJob);
router.get(
  "/get-applications",
  authenticationMiddleware,
  getUserApplicationsForJob
);

export default router;
