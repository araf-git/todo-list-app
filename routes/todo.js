import express from "express";
import {
  countTodo,
  createTodo,
  getTodos,
  modifyTodo,
  todoCompletedOnDate,
} from "../controllers/todo.js";

const router = express.Router();

// Routes
router
  .post("/:userID", createTodo) 
  .patch("/:todoID", modifyTodo)     
  .get("/count", countTodo)         
  .get("/completed/:date", todoCompletedOnDate)
  .get("/:userID", getTodos)          
    

export default router;
