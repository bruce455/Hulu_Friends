import { useEffect, useState } from "react";

function Friends() {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // -------------------------
  // LOAD FRIENDS
  // -------------------------
  const loadFriends = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `http://localhost:5000/friends/${user.id}`
      );
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error("Error loading friends:", err);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  // -------------------------
  // SEARCH USERS
  // -------------------------
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

  // -------------------------
  // ADD FRIEND
  // -------------------------
  const addFriend = async (friendId) => {
    try {
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

      setResults([]);
      setSearch("");

      loadFriends();
    } catch (err) {
      console.error("Add friend error:", err);
    }
  };

  // -------------------------
  // REMOVE FRIEND
  // -------------------------
  const removeFriend = async (friendId) => {
    try {
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

      loadFriends();
    } catch (err) {
      console.error("Remove friend error:", err);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>👥 Friends</h1>

      {/* CURRENT FRIENDS */}
      <h2>Your Friends</h2>

      {friends.length === 0 && <p>No friends yet.</p>}

      <ul>
        {friends.map((f) => (
          <li key={f.id} style={{ marginBottom: "8px" }}>
            {f.email}

            <button
              onClick={() => removeFriend(f.id)}
              style={{
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              ❌ Remove
            </button>
          </li>
        ))}
      </ul>

      {/* SEARCH */}
      <h2>Find Friends</h2>

      <input
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        style={{
          padding: "8px",
          width: "250px",
          marginBottom: "10px",
        }}
      />

      {/* SEARCH RESULTS */}
      <div>
        {results.map((u) => (
          <div
            key={u.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginTop: "10px",
              width: "250px",
            }}
          >
            <p>{u.email}</p>

            <button
              onClick={() => addFriend(u.id)}
              style={{ cursor: "pointer" }}
            >
              ➕ Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Friends;