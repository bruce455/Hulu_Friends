import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const [favorites, setFavorites] = useState([]);

  const { id } = useParams(); //  from /profile/:id
  const user = JSON.parse(localStorage.getItem("user"));

  const userIdToLoad = id || user?.id;

  useEffect(() => {
    if (!userIdToLoad) return;

    fetch(`http://localhost:5000/favorites/${userIdToLoad}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));
  }, [userIdToLoad]);

  return (
    <div>
      
      <h1>
        {id ? " Friend's Profile" : " Your Profile"}
      </h1>

      <h2>⭐ Favorite Movies</h2>

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