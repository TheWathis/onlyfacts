import jwt from "jsonwebtoken";

// Use the runtime config to get the JWT secret
const config = useRuntimeConfig();
export const JWT_SECRET = config.jwtSecret;

export const authenticateUser = async (event) => {
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (error) {
    console.error("Token verification error:", error);
    throw createError({
      statusCode: 401,
      message: "Invalid token",
    });
  }
};
