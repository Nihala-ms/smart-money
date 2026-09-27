const express = require("express");

const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// ADD BUDGET
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    const budget = await Budget.create({
      user: req.userId,
      category,
      amount,
      month,
    });

    res.status(201).json({
      message: "Budget added successfully.",
      budget,
    });
  } catch (error) {
    console.error("Add budget error:", error);

    res.status(500).json({
      message: "Server error while adding budget.",
    });
  }
});

// ======================================================
// GET BUDGETS + CALCULATE SPENT
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    const transactions = await Transaction.find({
      user: req.userId,
      type: "Expense",
    });

    const updatedBudgets = budgets.map((budget) => {
      const spent = transactions
        .filter((transaction) => {
          // Convert transaction date to YYYY-MM
          const transactionDate = new Date(transaction.date);

          const transactionYear =
            transactionDate.getFullYear();

          const transactionMonth = String(
            transactionDate.getMonth() + 1
          ).padStart(2, "0");

          const transactionMonthKey =
            `${transactionYear}-${transactionMonth}`;

          // Convert budget month to string
          const budgetMonthKey = String(budget.month)
            .trim()
            .slice(0, 7);

          // Compare category and month
          const categoryMatch =
            String(transaction.category)
              .trim()
              .toLowerCase() ===
            String(budget.category)
              .trim()
              .toLowerCase();

          const monthMatch =
            transactionMonthKey === budgetMonthKey;

          return categoryMatch && monthMatch;
        })
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        );

      return {
        ...budget.toObject(),
        spent,
      };
    });

    res.status(200).json({
      budgets: updatedBudgets,
    });
  } catch (error) {
    console.error("Get budgets error:", error);

    res.status(500).json({
      message: "Server error while fetching budgets.",
    });
  }
});

// ======================================================
// DELETE BUDGET
// ======================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found.",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully.",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    res.status(500).json({
      message: "Server error while deleting budget.",
    });
  }
});

module.exports = router;