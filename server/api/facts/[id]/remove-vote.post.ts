import { withTransaction } from "../../../db";
import pool from "../../../db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { userId, voteType } = body;

  if (!userId || !voteType) {
    throw createError({
      statusCode: 400,
      message: "User ID and vote type are required",
    });
  }

  try {
    return await withTransaction(async () => {
      const voteCheck = await pool.query(
        `SELECT vote_type FROM fact_votes
                 WHERE fact_id = $1 AND user_id = $2`,
        [id, userId],
      );

      if (voteCheck.rows.length === 0) {
        throw createError({
          statusCode: 400,
          message: "No vote found to remove",
        });
      }

      await pool.query(
        `DELETE FROM fact_votes
                 WHERE fact_id = $1 AND user_id = $2`,
        [id, userId],
      );

      const updateQuery =
        voteType === "upvote"
          ? "UPDATE facts SET upvotes = upvotes - 1 WHERE id = $1 RETURNING *"
          : "UPDATE facts SET downvotes = downvotes - 1 WHERE id = $1 RETURNING *";

      const result = await pool.query(updateQuery, [id]);

      if (result.rows.length === 0) {
        throw createError({
          statusCode: 404,
          message: "Fact not found",
        });
      }

      return result.rows[0];
    });
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error removing vote",
    });
  }
});
