import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

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

    const factId = event.context.params.id;

    // Verify the user owns the fact
    const factResult = await pool.query(
      "SELECT user_id FROM facts WHERE id = $1",
      [factId]
    );

    if (factResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Fact not found",
      });
    }

    const fact = factResult.rows[0];
    if (fact.user_id !== userId) {
      throw createError({
        statusCode: 403,
        message: "You do not have permission to delete this fact",
      });
    }

    // Delete the fact
    await pool.query("DELETE FROM facts WHERE id = $1", [factId]);

    return { message: "Fact deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting fact:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error deleting fact",
    });
  }
});
