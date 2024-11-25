import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    // Start a transaction to ensure consistent counts
    await pool.query("BEGIN");

    // Get total facts count
    const totalFactsResult = await pool.query(
      "SELECT COUNT(*) as total FROM facts",
    );
    const totalFacts = parseInt(totalFactsResult.rows[0].total);

    // Get user's facts count
    const userFactsResult = await pool.query(
      "SELECT COUNT(*) as count FROM facts WHERE user_id = $1",
      [userId],
    );
    const factsCreated = parseInt(userFactsResult.rows[0].count);

    // Get voting statistics
    const votesResult = await pool.query(
      `SELECT
        COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) as upvotes,
        COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END) as downvotes
       FROM fact_votes
       WHERE user_id = $1`,
      [userId],
    );
    const { upvotes, downvotes } = votesResult.rows[0];

    // Get unique facts seen count (we'll need to add a new table for this)
    const seenFactsResult = await pool.query(
      "SELECT COUNT(DISTINCT fact_id) as seen FROM fact_views WHERE user_id = $1",
      [userId],
    );
    const factsSeen = parseInt(seenFactsResult.rows[0].seen);
    const factsSeenPercentage = ((factsSeen / totalFacts) * 100).toFixed(1);

    await pool.query("COMMIT");

    return {
      factsCreated,
      voting: {
        upvotes: parseInt(upvotes) || 0,
        downvotes: parseInt(downvotes) || 0,
      },
      factsSeen,
      factsSeenPercentage: parseFloat(factsSeenPercentage),
      totalFacts,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error fetching profile stats:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error fetching profile statistics",
    });
  }
});
