import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
            max: 1000000
        },

        category: {
            type: String,
            required: true,
            enum: ["Food", "Travel", "Shopping", "Bills", "Other"],
            trim: true

        },

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;