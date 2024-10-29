import { Link } from "react-router-dom";
import { Button, TextField, Typography, Container } from "@mui/material";

export default function Register() {
  return (
    <Container component="main" maxWidth="xs">
      <header style={{ textAlign: "center", margin: "20px 0" }}>
        <Link to="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#1D4ED8", textDecoration: "none" }}>
          Pro Tube
        </Link>
      </header>
      <main>
        <Typography variant="h5" align="center">Register</Typography>
        <form>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <Button variant="contained" color="primary" fullWidth>
            Register
          </Button>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Already have an account? <Link to="/login" style={{ color: "#1D4ED8", textDecoration: "none" }}>Login</Link>
          </p>
        </form>
      </main>
    </Container>
  );
}
