import express from "express";
import { addExpense, getExpense, deleteExpense,updateExpense, getSingleExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpense);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);
router.get("/:id", getSingleExpense);

export default router;