import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Header: React.FC = () => (
  <AppBar position="sticky" sx={appBarStyles}>
    <Container maxWidth="lg">
      <Toolbar disableGutters>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={titleStyles} // Usamos sx en lugar de style
        >
          Pro Tube
        </Typography>
        <Box sx={buttonContainerStyles}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            sx={buttonStyles}
          >
            Log in
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/register"
            startIcon={<PersonAddIcon />}
            sx={buttonStyles}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

// Estilos en variables para evitar CSS directo
const appBarStyles = {
  backgroundColor: "#000",
  boxShadow: "none",
  borderBottom: "1px solid #333",
};

const titleStyles = {
  textDecoration: "none",
  color: "#FF0000",
  flexGrow: 1,
  fontWeight: "bold",
  textShadow: "1px 1px 2px #FFFFFF, -1px -1px 2px #FFFFFF, 1px -1px 2px #FFFFFF, -1px 1px 2px #FFFFFF",
  "&:hover": {
    color: "#FF5555", // Un cambio de color en hover para mejor feedback visual
  },
};

const buttonContainerStyles = {
  display: "flex",
  gap: 1.5,
};

const buttonStyles = {
  textTransform: "none",
  fontWeight: "medium",
};

export default Header;
