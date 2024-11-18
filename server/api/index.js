import express from "express";
import db from "../db/index.js";

const router = express.Router();

// Get random fact
router.get("/fact/random", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM facts ORDER BY (upvotes - downvotes) * RANDOM() DESC LIMIT 1",
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all facts
router.get("/facts", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM facts ORDER BY (upvotes - downvotes) DESC",
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
