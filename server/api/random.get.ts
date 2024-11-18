import pool from "../db";

export default defineEventHandler(async (event) => {
  try {
    const result = await pool.query(
      "SELECT * FROM facts ORDER BY RANDOM() LIMIT 1",
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching random fact from database",
    });
  }
});
