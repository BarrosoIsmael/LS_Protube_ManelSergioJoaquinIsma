import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; 
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate(); 

  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/"); 
  };

  return (
    <AppBar position="sticky" sx={appBarStyles}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={logoStyles}
          >
            Pro Tube
          </Typography>
          <Box sx={buttonContainerStyles}>
            {user ? (
              <>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ textTransform: "none", fontWeight: "bold", display: "flex", alignItems: "center" }}
                >
                  <AccountCircleIcon sx={{ mr: 1 }} /> {}
                  {user}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {}
                  <MenuItem
                    component={Link}
                    to="/profile" 
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>

                  {}
                  <MenuItem
                    component={Link}
                    to="/uploadvideo" 
                    onClick={handleMenuClose}
                  >
                    Upload Video
                  </MenuItem>

                  {}
                  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
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
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};


const appBarStyles = {
  backgroundColor: "#1c1c1e",
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
