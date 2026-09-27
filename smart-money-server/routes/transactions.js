const express = require("express");

const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// ADD TRANSACTION
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      type,
      title,
      category,
      amount,
      date,
      description,
    } = req.body;

    if (
      !type ||
      !title ||
      !category ||
      !amount ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Please fill in all required fields.",
      });
    }

    const transaction =
      await Transaction.create({
        user: req.userId,
        type,
        title,
        category,
        amount,
        date,
        description,
      });

    res.status(201).json({
      message:
        "Transaction added successfully.",
      transaction,
    });
  } catch (error) {
    console.error(
      "Add transaction error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while adding transaction.",
    });
  }
});

// ======================================================
// GET ALL TRANSACTIONS
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions =
      await Transaction.find({
        user: req.userId,
      }).sort({
        date: -1,
        createdAt: -1,
      });

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.error(
      "Get transactions error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching transactions.",
    });
  }
});

// ======================================================
// UPDATE TRANSACTION
// ======================================================

router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        type,
        title,
        category,
        amount,
        date,
        description,
      } = req.body;

      if (
        !type ||
        !title ||
        !category ||
        !amount ||
        !date
      ) {
        return res.status(400).json({
          message:
            "Please fill in all required fields.",
        });
      }

      const transaction =
        await Transaction.findOne({
          _id: req.params.id,
          user: req.userId,
        });

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found.",
        });
      }

      transaction.type = type;
      transaction.title = title;
      transaction.category = category;
      transaction.amount = Number(amount);
      transaction.date = date;
      transaction.description =
        description || "";

      await transaction.save();

      res.status(200).json({
        message:
          "Transaction updated successfully.",
        transaction,
      });
    } catch (error) {
      console.error(
        "Update transaction error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while updating transaction.",
      });
    }
  }
);

// ======================================================
// DELETE TRANSACTION
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const transaction =
        await Transaction.findOneAndDelete({
          _id: req.params.id,
          user: req.userId,
        });

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found.",
        });
      }

      res.status(200).json({
        message:
          "Transaction deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete transaction error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while deleting transaction.",
      });
    }
  }
);

module.exports = router;
