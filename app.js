import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import expenseRoutes from "./routes/expenseroute.js"; 

dotenv.config();

const app = express(); 

app.use(express.json());
app.use("/api/expenses", expenseRoutes);

app.get("/",(req,res)=>{
    res.send("working good");
});
connectDB();

app.listen(3000,()=>{
    console.log("server is running");
})