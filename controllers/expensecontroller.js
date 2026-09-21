import Expense from "../models/expensemodel.js";

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

const filter = {};

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
        await Expense.findByIdAndDelete(req.params.id);

        res.json({
            message: "Expense deleted"
        });

    } catch (error) {
        res.json({
            message: error.message
        });
    }
};
export const updateExpense = async (req,res) => {
    try{
        const expense = await Expense.findByIdAndUpdate(req.params.id,req.body,{ new: true,
            runValidators: true });
         
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

    } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
        });
    }
};

export const getSingleExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        

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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
   
