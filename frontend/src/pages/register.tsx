import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
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
        login(username); // Guarda el nombre de usuario en el contexto
        navigate("/"); // Redirige a la página de inicio
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred while registering. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: '#1c1c1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#2e2e2e', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#FF0000", textDecoration: "none", textShadow: '1px 1px 2px #FFFFFF, -1px -1px 2px #FFFFFF, 1px -1px 2px #FFFFFF, -1px 1px 2px #FFFFFF' }}>
            Pro Tube
          </Link>
        </header>
        <main>
          <Typography variant="h5" align="center" color="#FFFFFF" sx={{ marginBottom: 2 }}>
            Register
          </Typography>
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
              sx={{ backgroundColor: '#333', borderRadius: 1 }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              InputProps={{ style: { color: '#FFFFFF' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ backgroundColor: '#333', borderRadius: 1 }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              InputProps={{ style: { color: '#FFFFFF' } }}
            />
            {error && <Typography color="error" align="center" sx={{ marginBottom: 2 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
              Register
            </Button>
            <Typography align="center" sx={{ marginTop: 2, color: '#FFFFFF' }}>
              Already have an account? <Link to="/login" style={{ color: "#1D4ED8", textDecoration: "none" }}>Login</Link>
            </Typography>
          </form>
        </main>
      </Container>
    </Box>
  );
}
