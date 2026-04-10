import { useLocation } from "react-router-dom";

function MovieDetails() {
  const { state } = useLocation();
  const movie = state;

  if (!movie) return <p>No movie selected</p>;

  const addToFavorites = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("You must be logged in to add favorites!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title,
          poster_path: movie.poster_path,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save favorite");
      }

      const data = await res.json();
      console.log("Saved to favorites:", data);

      alert("Added to favorites ⭐");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{movie.title}</h1>

      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.title}
        style={{ width: "250px", borderRadius: "10px" }}
      />

      <p style={{ maxWidth: "600px" }}>{movie.overview}</p>

      <p>
        <strong>Release:</strong> {movie.release_date}
      </p>

      <button
        onClick={addToFavorites}
        style={{
          padding: "10px 15px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        ⭐ Add to Favorites
      </button>
    </div>
  );
}

export default MovieDetails;