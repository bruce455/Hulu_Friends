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

app.post("/login", async (req, res) => { //this is used for login
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/favorites", async (req, res) => { //saving movie to favorites to be able to show on profile page and for friends
  const { user_id, movie_id, movie_title, poster_path } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO favorite_movies (user_id, movie_id, movie_title, poster_path)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, movie_id, movie_title, poster_path]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving favorite");
  }
});


app.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM favorite_movies WHERE user_id = $1",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching favorites");
  }
});
app.get("/users/search", async (req, res) => {
  const { q, userId } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT id, email
      FROM users
      WHERE email ILIKE $1
      AND ($2::int IS NULL OR id != $2)
      AND ($2::int IS NULL OR id NOT IN (
        SELECT friend_id FROM friends WHERE user_id = $2
      ))
      `,
      [`%${q}%`, userId || null]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching users");
  }
});


app.get("/friends/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.email
      FROM friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching friends");
  }
});
app.post("/friends", async (req, res) => {
  const { user_id, friend_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2) RETURNING *",
      [user_id, friend_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding friend");
  }
});

app.delete("/friends", async (req, res) => {
  const { user_id, friend_id } = req.body;

  try {
    const result = await pool.query(
      "DELETE FROM friends WHERE user_id = $1 AND friend_id = $2 RETURNING *",
      [user_id, friend_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Friend not found");
    }

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting friend");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));