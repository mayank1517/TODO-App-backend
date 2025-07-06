import express from "express";
import {
  RegisterUser,
  userLogin,
  userLogout,
} from "../Controller/user.controller.js";

const router = express.Router();
router.post("/register", RegisterUser);
router.get("/login", userLogin);
router.get("/logout", userLogout);

export default router;
