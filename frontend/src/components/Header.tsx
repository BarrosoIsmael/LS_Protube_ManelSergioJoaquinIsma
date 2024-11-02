import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Header: React.FC = () => (
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
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/login" 
            startIcon={<LoginIcon />}
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Log in
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            component={Link} 
            to="/register" 
            startIcon={<PersonAddIcon />}
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;
