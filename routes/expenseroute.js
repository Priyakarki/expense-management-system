import express from "express";
import { addExpense, getExpense, deleteExpense,updateExpense, getSingleExpense , } from "../controllers/expenseController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpense);
router.delete("/:id", authMiddleware,deleteExpense);
router.put("/:id", authMiddleware, updateExpense);
router.get("/:id",authMiddleware, getSingleExpense);

export default router;