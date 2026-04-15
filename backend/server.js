
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   WATCHED MOVIES
========================= */
app.get("/watched", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.username, users.email, watched_movies.movie_title
      FROM users
      JOIN watched_movies ON users.id = watched_movies.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* =========================
   SIGNUP
========================= */
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    // duplicate username/email
    if (err.code === "23505") {
      return res.status(400).send("Username or email already exists");
    }

    res.status(500).send("Error creating user");
  }
});

/* =========================
   LOGIN (email OR username)
========================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // "email" = identifier

  try {
    const result = await pool.query(
      `SELECT id, username, email, password
       FROM users
       WHERE email = $1 OR username = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    // remove password before sending back
    delete user.password;

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* =========================
   FAVORITES
========================= */
app.post("/favorites", async (req, res) => {
  const { user_id, movie_id, movie_title, poster_path } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO favorite_movies (user_id, movie_id, movie_title, poster_path)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
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

/* =========================
   SEARCH USERS (by username)
========================= */
app.get("/users/search", async (req, res) => {
  const { q, userId } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT id, username, email
      FROM users
      WHERE username ILIKE $1
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

/* =========================
   FRIENDS
========================= */
app.get("/friends/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.username, u.email
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
      `INSERT INTO friends (user_id, friend_id)
       VALUES ($1, $2)
       RETURNING *`,
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
      `DELETE FROM friends
       WHERE user_id = $1 AND friend_id = $2
       RETURNING *`,
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

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

