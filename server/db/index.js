import pkg from "pg";
import config from "./config.js";
export { withTransaction, query, DatabaseError } from "./utils";
const { Pool } = pkg;

const pool = new Pool(config);

// Add error handling for the pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
