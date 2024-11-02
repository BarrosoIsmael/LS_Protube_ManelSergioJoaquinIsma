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
          sx={logoStyles} // Cambiado a sx
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

// Estilos para el fondo gris oscuro del navegador
const appBarStyles = {
  backgroundColor: "#1c1c1e", // Fondo gris oscuro
  boxShadow: "none",
  borderBottom: "1px solid #333",
};

const logoStyles = {
  color: "#FF0000",
  fontWeight: "bold",
  textDecoration: "none",
  textShadow: "1px 1px 2px #FFFFFF, -1px -1px 2px #FFFFFF, 1px -1px 2px #FFFFFF, -1px 1px 2px #FFFFFF",
  fontSize: "24px",
  flexGrow: 1,
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
