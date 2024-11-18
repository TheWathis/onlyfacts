import pool from "../db";

export default defineEventHandler(async (event) => {
  try {
    const result = await pool.query(
      "SELECT * FROM facts ORDER BY created_at DESC",
    );
    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching facts from database",
    });
  }
});
