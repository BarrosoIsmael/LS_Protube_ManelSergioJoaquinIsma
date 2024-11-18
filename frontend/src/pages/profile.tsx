import React from "react";
import { Container, Box, Typography, Grid, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Título de la página */}
        <Typography variant="h4" component="h1" gutterBottom>
          Mi Perfil
        </Typography>

        {/* Información de usuario */}
        <Paper sx={{ width: "100%", padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Información del usuario
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Nombre de usuario: <strong>Usuario123</strong>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Correo electrónico: <strong>usuario123@mail.com</strong>
          </Typography>
        </Paper>

        {/* Sección de Videos Subidos */}
        <Box sx={{ width: "100%", marginBottom: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Videos Subidos
          </Typography>
          <Grid container spacing={2}>
            {/* Aquí irán los videos cuando se integren los datos */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ padding: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6">Video 1</Typography>
                <Button variant="outlined" component={Link} to="/video/1" sx={{ marginTop: "10px" }}>
                  Ver Video
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ padding: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6">Video 2</Typography>
                <Button variant="outlined" component={Link} to="/video/2" sx={{ marginTop: "10px" }}>
                  Ver Video
                </Button>
              </Paper>
            </Grid>

            {/* Video 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ padding: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6">Video 3</Typography>
                <Button variant="outlined" component={Link} to="/video/3" sx={{ marginTop: "10px" }}>
                  Ver Video
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Sección de Comentarios */}
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5" gutterBottom>
            Mis Comentarios
          </Typography>
          <Grid container spacing={2}>
            {/* Aquí irán los comentarios cuando se integren los datos */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ padding: "15px" }}>
                <Typography variant="body1" color="textSecondary">
                  Comentario en Video 1: <strong>¡Gran video!</strong>
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ padding: "15px" }}>
                <Typography variant="body1" color="textSecondary">
                  Comentario en Video 2: <strong>Muy informativo, gracias.</strong>
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ padding: "15px" }}>
                <Typography variant="body1" color="textSecondary">
                  Comentario en Video 3: <strong>Excelente contenido, sigue así.</strong>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
    