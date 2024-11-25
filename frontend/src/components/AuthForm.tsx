import React, { useState } from "react";
import { Button, TextField, Typography, Box, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

interface AuthFormProps {
  title: string;
  buttonText: string;
  onSubmit: (username: string, password: string) => void;
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, buttonText, onSubmit, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <Box sx={containerStyles}>
      <header style={headerStyles}>
        <Typography variant="h4" component={Link} to="/" sx={logoStyles}>
          Pro Tube
        </Typography>
      </header>
      <Typography variant="h5" align="center" sx={titleStyles}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={inputStyles}
        />
        <TextField
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={inputStyles}
        />
        {error && <Typography color="error" align="center" sx={errorStyles}>{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={buttonStyles}>
          {buttonText.toUpperCase()}
        </Button>
        <Typography align="center" sx={footerTextStyles}>
          {buttonText === "Login" ? (
            <>
              Don't have an account?{" "}
              <MuiLink component={Link} to="/register" sx={linkStyles}>
                Register
              </MuiLink>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" sx={linkStyles}>
                Login
              </MuiLink>
            </>
          )}
        </Typography>
      </form>
    </Box>
  );
};


const containerStyles = {
  backgroundColor: "#2e2e2e",
  padding: 4,
  borderRadius: 2,
  boxShadow: 3,
  maxWidth: 400,
  margin: "auto",
  mt: 8,
};

const headerStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
};

const logoStyles = {
  color: "#FF0000",
  fontWeight: "bold",
  textDecoration: "none",
  textShadow: "1px 1px 2px #FFFFFF, -1px -1px 2px #FFFFFF, 1px -1px 2px #FFFFFF, -1px 1px 2px #FFFFFF",
  fontSize: "24px",
};

const titleStyles = {
  color: "#FFFFFF",
  marginBottom: 2,
};

const inputStyles = {
  backgroundColor: "#333",
  borderRadius: 1,
  "& .MuiInputBase-input": { color: "#FFFFFF" },
  "& .MuiInputLabel-root": { color: "#FFFFFF" },
  mt: 1,
  mb: 2,
};

const errorStyles = {
  marginBottom: 2,
};

const buttonStyles = {
  backgroundColor: "#1D4ED8",
  color: "#FFFFFF",
  fontWeight: "medium",
  marginTop: 2,
  "&:hover": {
    backgroundColor: "#2563EB",
  },
};

const footerTextStyles = {
  marginTop: 2,
  color: "#FFFFFF",
};

const linkStyles = {
  color: "#1D4ED8",
  textDecoration: "none",
};

export default AuthForm;
