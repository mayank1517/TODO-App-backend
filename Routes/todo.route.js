import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../Controller/todo.controller.js";
import { authenticationMiddleware } from "../Middleware/authorize.js";

const router = express.Router();

router.post("/create", authenticationMiddleware, createTodo);
router.get("/Todos", authenticationMiddleware, getTodos);
router.put("/update/:id", authenticationMiddleware, updateTodo);
router.delete("/delete/:id", authenticationMiddleware, deleteTodo);
router.get("/todo/:id", authenticationMiddleware, getTodoById);

export default router;
