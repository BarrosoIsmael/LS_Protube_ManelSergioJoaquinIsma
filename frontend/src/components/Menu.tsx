// src/components/Menu.tsx
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Menu: React.FC = () => (
  <Box sx={{ display: "flex", gap: 1.5 }}>
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/login"
      startIcon={<AccountCircle />}
      sx={{ textTransform: "none", fontWeight: "medium" }}
    >
      Log in
    </Button>
    <Button
      variant="contained"
      color="secondary"
      component={Link}
      to="/register"
      startIcon={<AccountCircle />}
      sx={{ textTransform: "none", fontWeight: "medium" }}
    >
      Register
    </Button>
  </Box>
);

export default Menu;
