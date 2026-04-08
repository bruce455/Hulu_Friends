// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "movies_app",
  password: "YOUR_PASSWORD_HERE",
  port: 5432,
});

export default pool; 