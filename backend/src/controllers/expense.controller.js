
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.model.js";

// Add Expense
const addExpense = asyncHandler(async (req, res) => {
    const { name, amount, category, date, description } = req.body;

    if ([name, category].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if(amount < 1) throw new ApiError(400, "Amount must be more than 1 rs")

    const expense = await Expense.create({
        amount,
        category,
        date,
        description,
        user: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(201, expense, "Expense added successfully")
    );
});

// Update Expense
const updateExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, amount, category } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { expenseName: name, amount, category },
        { new: true, runValidators: true }
    );

    if (!updatedExpense) {
        throw new ApiError(404, "Expense not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedExpense, "Expense updated successfully")
    );
});

// Delete Expense
const deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({
        _id: id,
        user: req.user._id,
    });

    if (!deletedExpense) {
        throw new ApiError(404, "Expense not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Expense deleted successfully")
    );
});

// Get Single Expense
const getSingleExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const expense = await Expense.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!expense) {
        throw new ApiError(404, "Expense not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, expense, "Expense fetched successfully")
    );
});

// Get All Expenses
const getAllExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, expenses, "All expenses fetched successfully")
    );
});

export {
    addExpense,
    updateExpense,
    deleteExpense,
    getSingleExpense,
    getAllExpenses,
};