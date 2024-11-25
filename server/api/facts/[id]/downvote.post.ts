import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

const authenticateUser = async (event) => {
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Invalid token",
    });
  }
};

export default defineEventHandler(async (event) => {
  try {
    const userId = await authenticateUser(event);
    const factId = getRouterParam(event, "id");
    const voteType = event.path.includes("upvote") ? "upvote" : "downvote";

    await pool.query("BEGIN");

    // Check if user already voted
    const voteCheck = await pool.query(
      `SELECT vote_type FROM fact_votes
       WHERE fact_id = $1 AND user_id = $2`,
      [factId, userId],
    );

    if (voteCheck.rows.length > 0) {
      const currentVoteType = voteCheck.rows[0].vote_type;

      if (currentVoteType === voteType) {
        throw createError({
          statusCode: 400,
          message: "Already voted on this fact",
        });
      }

      // Update vote type and adjust counts
      await pool.query(
        `UPDATE fact_votes
         SET vote_type = $1
         WHERE fact_id = $2 AND user_id = $3`,
        [voteType, factId, userId],
      );

      // Update fact counts
      const result = await pool.query(
        `UPDATE facts
         SET ${currentVoteType}s = ${currentVoteType}s - 1,
             ${voteType}s = ${voteType}s + 1
         WHERE id = $1
         RETURNING *`,
        [factId],
      );

      if (result.rows.length === 0) {
        throw createError({
          statusCode: 404,
          message: "Fact not found",
        });
      }

      await pool.query("COMMIT");
      return { ...result.rows[0], hasVoted: true };
    }

    // If no previous vote exists, create new vote
    await pool.query(
      `INSERT INTO fact_votes (fact_id, user_id, vote_type)
       VALUES ($1, $2, $3)`,
      [factId, userId, voteType],
    );

    const result = await pool.query(
      `UPDATE facts
       SET ${voteType}s = ${voteType}s + 1
       WHERE id = $1
       RETURNING *`,
      [factId],
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Fact not found",
      });
    }

    await pool.query("COMMIT");
    return { ...result.rows[0], hasVoted: true };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Database error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Error ${voteType}ing fact`,
    });
  }
});
