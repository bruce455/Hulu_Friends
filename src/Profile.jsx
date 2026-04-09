import { useEffect, useState } from "react";

function Profile() {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/watched")
      .then((res) => res.json())
      .then((data) => setWatched(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>👤 Profile</h1>

      <h2>Your Watched Movies</h2>

      {watched.length === 0 && <p>No movies yet.</p>}

      <ul>
        {watched.map((movie, index) => (
          <li key={index}>
            {movie.email} - {movie.movie_title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;