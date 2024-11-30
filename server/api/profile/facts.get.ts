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

    const result = await pool.query(
      "SELECT * FROM facts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );

    return result.rows;
  } catch (error: any) {
    console.error("Error fetching user facts:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error fetching user facts",
    });
  }
});
