import pkg from "pg";
const { Pool } = pkg;
import config from "./config.js";

const pool = new Pool(config);

export default pool;
