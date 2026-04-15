import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ0YTFmNWZmMjJhZDFkMTU5YzIwNzUwNDBkZDc3ZCIsIm5iZiI6MTc3NDQ3NjA3NC41ODA5OTk5LCJzdWIiOiI2OWM0NWIyYWVhMzZkMmJlNjQ0ZGRmNTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.78Z4MBVVFsI26KY_O69mekO1lN3qYN6mIVlodrNG3ss",
    },
  };

  // this is to fetch the trending movies
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

      
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

   
      {loading && <p>Loading...</p>}

    
      {!loading && movies.length === 0 && query && (
        <p>No results found.</p>
      )}


      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{ width: "150px", cursor: "pointer" }}
            onClick={() => navigate("/movie", { state: movie })}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;


