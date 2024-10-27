import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header: React.FC = () => (
  <AppBar position="sticky" color="default" sx={{ boxShadow: 'none' }}>
    <Container maxWidth="lg">
      <Toolbar disableGutters>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          Pro Tube
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          component={Link} 
          to="/login" 
          startIcon={<AccountCircle />}
        >
          Log in
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          component={Link} 
          to="/register" 
          startIcon={<AccountCircle />}
        >
          Register
        </Button>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;
