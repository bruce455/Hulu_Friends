import React, { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return; 

    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWQ0YTFmNWZmMjJhZDFkMTU5YzIwNzUwNDBkZDc3ZCIsIm5iZiI6MTc3NDQ3NjA3NC41ODA5OTk5LCJzdWIiOiI2OWM0NWIyYWVhMzZkMmJlNjQ0ZGRmNTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.78Z4MBVVFsI26KY_O69mekO1lN3qYN6mIVlodrNG3ss",
      },
    };

    setLoading(true);

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [query]); 

  return (
    <div>
      <h1>Movie Search</h1>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />


      {!loading && movies.length === 0 && query && <p>No results found.</p>}

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> ({movie.release_date})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;