import pool from "../../../db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const userId = body.userId;

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  try {
    // Start transaction
    await pool.query("BEGIN");

    // Check if user already voted
    const voteCheck = await pool.query(
      `SELECT vote_type FROM fact_votes
       WHERE fact_id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (voteCheck.rows.length > 0) {
      throw createError({
        statusCode: 400,
        message: "Already voted on this fact",
      });
    }

    // Add vote record
    await pool.query(
      `INSERT INTO fact_votes (fact_id, user_id, vote_type)
       VALUES ($1, $2, 'downvote')`,
      [id, userId],
    );

    // Update fact
    const result = await pool.query(
      "UPDATE facts SET downvotes = downvotes + 1 WHERE id = $1 RETURNING *",
      [id],
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
      message: error.message || "Error downvoting fact",
    });
  }
});
