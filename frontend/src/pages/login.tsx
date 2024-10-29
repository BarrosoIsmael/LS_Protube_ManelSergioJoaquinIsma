import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container } from "@mui/material";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Clear previous errors
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (response.ok) {
        // Redirect to homepage on successful login
        navigate("/");
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <header style={{ textAlign: "center", margin: "20px 0" }}>
        <Link to="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#1D4ED8", textDecoration: "none" }}>
          Pro Tube
        </Link>
      </header>
      <main>
        <Typography variant="h5" align="center">Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" align="center">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Don't have an account? <Link to="/register" style={{ color: "#1D4ED8", textDecoration: "none" }}>Register</Link>
          </p>
        </form>
      </main>
    </Container>
  );
}
