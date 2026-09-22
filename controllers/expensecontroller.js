import Expense from "../models/expensemodel.js";
import mongoose from "mongoose";

export const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expense = await Expense.create({
            title,
            amount,
            category,
            date,
             user: req.userId
        });

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const getExpense = async (req, res) => {
    try { 
         const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const search = req.query.search;
             const category = req.query.category;

const filter = {user: req.userId};

if (search) {
    filter.title = { $regex: search, $options: "i" };
}

if (category) {
    filter.category = category;
}
       const expenses = await Expense.find(filter)
       .sort({ amount: -1 })
        .skip(skip)
    .limit(limit);
    const totalExpenses = await Expense.countDocuments(filter);
        

        res.status(200).json({
            success: true,
              page,
              limit,
    totalExpenses,
    expenses
});
       

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
});

        res.json({
            message: "Expense deleted"
        });

    } catch (error) {

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid expense ID"
        });
    }

    res.status(500).json({
        success: false,
        message: error.message
    });
}
};
export const updateExpense = async (req,res) => {
    try{
       const expense = await Expense.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.userId
    },
    req.body,
    {
        new: true,
        runValidators: true
    }
);
         
        res.json({
            success: true,
    message: "Expense updated",
    expense
        }); 
         if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

    }catch (error) {

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid expense ID"
        });
    }

    res.status(500).json({
        success: false,
        message: error.message
    });
}
};

export const getSingleExpense = async (req, res) => {
    try {
       const expense = await Expense.findOne({
    _id: req.params.id,
    user: req.userId
});

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            expense
        });

    } catch (error) {

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid expense ID"
        });
    }

    res.status(500).json({
        success: false,
        message: error.message
    });
}
};
   
export const getExpenseSummary = async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalAmount: summary[0]?.totalAmount || 0
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCategorySummary = async (req, res) => {
    try {

        const summary = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            summary
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getMonthlySummary = async (req, res) => {
    try {

        const summary = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            summary
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getExpenseStats = async (req, res) => {
    try {

        const stats = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: 1 },
                    averageExpense: { $avg: "$amount" },
                    highestExpense: { $max: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {
                totalExpenses: 0,
                averageExpense: 0,
                highestExpense: 0
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};