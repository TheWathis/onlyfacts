import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    // Get user ID if authenticated
    let userId = null;
    const authHeader = getHeader(event, "Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      userId = decoded.userId;
    }

    await pool.query("BEGIN");

    const result = await pool.query(
      "SELECT * FROM facts ORDER BY RANDOM() LIMIT 1",
    );

    const fact = result.rows[0];

    // If user is authenticated, record the view
    if (userId && fact) {
      await pool.query(
        `INSERT INTO fact_views (user_id, fact_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, fact_id) DO NOTHING`,
        [userId, fact.id],
      );
    }

    await pool.query("COMMIT");
    return fact;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Database error:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching random fact from database",
    });
  }
});
