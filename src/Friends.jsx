function Friends() {
  const friends = ["Alice", "Bob", "Charlie"];

  return (
    <div>
      <h1>👥 Friends</h1>

      <ul>
        {friends.map((friend, index) => (
          <li key={index}>{friend}</li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;