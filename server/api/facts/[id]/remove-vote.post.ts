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
    // Start transaction
    await pool.query("BEGIN");

    // Check if user has voted
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

    // Remove vote record
    await pool.query(
      `DELETE FROM fact_votes
       WHERE fact_id = $1 AND user_id = $2`,
      [id, userId],
    );

    // Update fact counts based on vote type
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

    await pool.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Database error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error removing vote",
    });
  }
});
