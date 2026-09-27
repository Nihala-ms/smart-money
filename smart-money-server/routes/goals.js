const express = require("express");

const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// ADD GOAL
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      targetAmount,
      savedAmount,
      deadline,
      description,
    } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    const goal = await Goal.create({
      user: req.userId,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
      description,
    });

    res.status(201).json({
      message: "Goal added successfully.",
      goal,
    });
  } catch (error) {
    console.error("Add goal error:", error);

    res.status(500).json({
      message: "Server error while adding goal.",
    });
  }
});

// ======================================================
// GET ALL GOALS
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      goals,
    });
  } catch (error) {
    console.error("Get goals error:", error);

    res.status(500).json({
      message: "Server error while fetching goals.",
    });
  }
});

// ======================================================
// UPDATE SAVED AMOUNT
// ======================================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { savedAmount } = req.body;

    if (
      savedAmount === undefined ||
      savedAmount === null ||
      savedAmount < 0
    ) {
      return res.status(400).json({
        message: "Please provide a valid saved amount.",
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    if (Number(savedAmount) > Number(goal.targetAmount)) {
      return res.status(400).json({
        message: "Saved amount cannot exceed the target amount.",
      });
    }

    goal.savedAmount = Number(savedAmount);

    await goal.save();

    res.status(200).json({
      message: "Goal updated successfully.",
      goal,
    });
  } catch (error) {
    console.error("Update goal error:", error);

    res.status(500).json({
      message: "Server error while updating goal.",
    });
  }
});

// ======================================================
// DELETE GOAL
// ======================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    res.status(200).json({
      message: "Goal deleted successfully.",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    res.status(500).json({
      message: "Server error while deleting goal.",
    });
  }
});

module.exports = router;