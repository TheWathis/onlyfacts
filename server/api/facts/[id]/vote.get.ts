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
    const factId = getRouterParam(event, "id");

    const result = await pool.query(
      `SELECT vote_type FROM fact_votes
       WHERE fact_id = $1 AND user_id = $2`,
      [factId, decoded.userId],
    );

    return result.rows[0] || { vote_type: null };
  } catch (error) {
    console.error("Error checking vote:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error checking vote",
    });
  }
});
