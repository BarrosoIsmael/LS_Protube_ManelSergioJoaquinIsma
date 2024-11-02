import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from "react";
import { useAuth } from "./../context/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#000', boxShadow: 'none', borderBottom: '1px solid #333' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: '#FF0000', 
              flexGrow: 1, 
              fontWeight: 'bold', 
              textShadow: '1px 1px 2px #FFFFFF, -1px -1px 2px #FFFFFF, 1px -1px 2px #FFFFFF, -1px 1px 2px #FFFFFF' 
            }}
          >
            Pro Tube
          </Typography>

          {user ? (
            <>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
                <Typography sx={{ marginLeft: 1, color: '#FFFFFF' }}>{user}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={() => { logout(); handleClose(); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/login" 
                startIcon={<AccountCircle />}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Log in
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                component={Link} 
                to="/register" 
                startIcon={<AccountCircle />}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
