// import { withTransaction } from "../../../db";
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
    const { voteType } = await readBody(event);

    if (!voteType) {
      throw createError({
        statusCode: 400,
        message: "Vote type is required",
      });
    }

    await pool.query("BEGIN");

    // Remove vote record
    await pool.query(
      `DELETE FROM fact_votes
       WHERE fact_id = $1 AND user_id = $2
       RETURNING vote_type`,
      [factId, userId],
    );

    // Update fact counts
    const result = await pool.query(
      `UPDATE facts
       SET ${voteType}s = ${voteType}s - 1
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
    return result.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error removing vote",
    });
  }
});
