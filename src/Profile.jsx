import { useEffect, useState } from "react";

function Profile() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(`http://localhost:5000/favorites/${user.id}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>⭐ Your Favorites</h1>

      {favorites.length === 0 && <p>No favorites yet.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {favorites.map((movie) => (
          <div key={movie.id} style={{ width: "150px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.movie_title}
              style={{ width: "100%" }}
            />
            <p>{movie.movie_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;