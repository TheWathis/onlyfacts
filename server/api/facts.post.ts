import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    // Authenticate the user
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

    const body = await readBody(event);

    if (!body.fact) {
      throw createError({
        statusCode: 400,
        message: "Fact content is required",
      });
    }

    const result = await pool.query(
      "INSERT INTO facts (fact, user_id) VALUES ($1, $2) RETURNING *",
      [body.fact, userId],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error creating new fact",
    });
  }
});
