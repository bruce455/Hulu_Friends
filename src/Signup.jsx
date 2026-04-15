import { useState } from "react";
import { validation } from "./validation";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const error = validation(email, password);
    if (error) {
      alert(error);
      return;
    }

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Data submitted to database:", data);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
  <div className="p-4 shadow rounded" style={{ width: "350px" }}>
    <h2 className="mb-4 text-center">Sign Up</h2>

    <Form onSubmit={handleSignup}>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" className="w-100">
        Sign Up
      </Button>
    </Form>
  </div>
</div>
  );
}

export default Signup;