import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw createError({
        statusCode: 401,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Create a sanitized user object (without password)
    const sanitizedUser = {
      id: user.id,
      username: user.username,
    };

    return {
      user: sanitizedUser,
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error during login",
    });
  }
});
