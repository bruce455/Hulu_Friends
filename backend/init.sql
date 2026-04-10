-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- =========================
-- FAVORITE MOVIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS favorite_movies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_title TEXT NOT NULL,
  poster_path TEXT
);

-- =========================
-- FRIENDS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL
);

