
import { Router } from "express";
import {
    addExpense,
    updateExpense,
    deleteExpense,
    getSingleExpense,
    getAllExpenses,
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const expenseRouter = Router();

// Protected routes
expenseRouter.route("/").post(verifyJWT, addExpense).get(verifyJWT, getAllExpenses);
expenseRouter
    .route("/:id")
    .get(verifyJWT, getSingleExpense)
    .put(verifyJWT, updateExpense)
    .delete(verifyJWT, deleteExpense);

export default expenseRouter;