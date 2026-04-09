import { useEffect, useState } from "react";

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ0YTFmNWZmMjJhZDFkMTU5YzIwNzUwNDBkZDc3ZCIsIm5iZiI6MTc3NDQ3NjA3NC41ODA5OTk5LCJzdWIiOiI2OWM0NWIyYWVhMzZkMmJlNjQ0ZGRmNTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.78Z4MBVVFsI26KY_O69mekO1lN3qYN6mIVlodrNG3ss",
    },
  };

  // 🔹 Fetch movies (trending OR search)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      let url;

      if (query) {
        url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`;
      } else {
        url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
      }

      try {
        const res = await fetch(url, API_OPTIONS);
        const json = await res.json();
        setMovies(json.results || []);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [query]); // runs when query changes

  return (
    <div>
      <h1>🎬 Movie App</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* 🔄 Loading */}
      {loading && <p>Loading...</p>}

      {/* ❌ No results */}
      {!loading && movies.length === 0 && query && (
        <p>No results found.</p>
      )}

      {/* 🎥 Movie Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ width: "150px" }}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <p>
              <strong>{movie.title}</strong>
            </p>
            <p>{movie.release_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;


