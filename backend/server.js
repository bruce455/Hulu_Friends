// server.js
import express from "express";
import cors from "cors";
import pool from "./db.js"; 

const app = express();
app.use(cors());
app.use(express.json());

app.get("/watched", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.email, watched_movies.movie_title
      FROM users
      JOIN watched_movies ON users.id = watched_movies.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));