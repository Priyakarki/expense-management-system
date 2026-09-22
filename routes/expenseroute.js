import express from "express";
import { addExpense, getExpense, deleteExpense,updateExpense, getSingleExpense ,getExpenseSummary, getCategorySummary, getMonthlySummary,getExpenseStats } from "../controllers/expensecontroller.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpense);
router.get("/summary", authMiddleware, getExpenseSummary);
router.get("/summary/category", authMiddleware, getCategorySummary);
router.get("/summary/monthly", authMiddleware, getMonthlySummary);
router.get("/summary/stats", authMiddleware, getExpenseStats);
router.delete("/:id", authMiddleware,deleteExpense);
router.put("/:id", authMiddleware, updateExpense);
router.get("/:id",authMiddleware, getSingleExpense);


export default router;