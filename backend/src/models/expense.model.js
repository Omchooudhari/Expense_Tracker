
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        // expenseName: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: String,
        }, 
        description: {
            type: String,
            required: false,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);