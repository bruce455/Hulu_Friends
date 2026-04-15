import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Friends() {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Load current friends
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/friends/${user.id}`)
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch((err) => console.error(err));
  }, []);

  // Search users
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/users/search?q=${value}&userId=${user.id}`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Add friend
  const addFriend = async (friendId) => {
    await fetch("http://localhost:5000/friends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        friend_id: friendId,
      }),
    });

    // refresh friends
    const res = await fetch(
      `http://localhost:5000/friends/${user.id}`
    );
    const data = await res.json();
    setFriends(data);
  };

  //Remove friend
  const removeFriend = async (friendId) => {
    await fetch("http://localhost:5000/friends", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        friend_id: friendId,
      }),
    });

    // refresh friends
    const res = await fetch(
      `http://localhost:5000/friends/${user.id}`
    );
    const data = await res.json();
    setFriends(data);
  };

  return (
    <div>
      <h1>👥 Friends</h1>

      
      <h2>Your Friends</h2>
      {friends.length === 0 && <p>No friends yet.</p>}

      <ul>
        {friends.map((u) => (
          <li key={u.id}>
            
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate(`/profile/${u.id}`)}
            >
              {u.username}
            </span>

            {" "}
            <button onClick={() => removeFriend(u.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      
      <h2>Find Friends</h2>
      <input
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
      />

      <ul>
        {results.map((u) => (
          <li key={u.id}>
            
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate(`/profile/${u.id}`)}
            >
              {u.username}
            </span>

            {" "}
            <button onClick={() => addFriend(u.id)}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;