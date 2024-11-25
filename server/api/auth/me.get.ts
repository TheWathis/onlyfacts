import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [decoded.userId],
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    return result.rows[0];
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw createError({
        statusCode: 401,
        message: "Invalid token",
      });
    }

    console.error("Auth check error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Authentication check failed",
    });
  }
});
