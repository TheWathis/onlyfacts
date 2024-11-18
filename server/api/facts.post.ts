import pool from "../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.fact) {
    throw createError({
      statusCode: 400,
      message: "Fact content is required",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO facts (fact) VALUES ($1) RETURNING *",
      [body.fact],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: 500,
      message: "Error creating new fact",
    });
  }
});
