import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "~/server/db";
import { JWT_SECRET } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, passwordHash],
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return { user, token };
  } catch (error) {
    console.error("Registration error:", error);

    // Check for duplicate username error
    if (error.code === "23505" && error.constraint === "users_username_key") {
      throw createError({
        statusCode: 400,
        message: "Username already exists. Please choose a different username.",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Error creating user. Please try again.",
    });
  }
});
