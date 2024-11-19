import { Pool, PoolClient } from "pg";
import pool from "./index";

type TransactionCallback<T> = (client: PoolClient) => Promise<T>;

export class DatabaseError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: any,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export const withTransaction = async <T>(
  callback: TransactionCallback<T>,
): Promise<T> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError("Database transaction failed", 500, error);
  } finally {
    client.release();
  }
};

export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    throw new DatabaseError("Database query failed", 500, error);
  }
};
