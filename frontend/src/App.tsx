import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import VideoPlayer from "./pages/videoPlayer";
import UploadVideo from "./pages/UploadVideo";
import Profile from "./pages/profile";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";

const App: React.FC = () => {
  const location = useLocation();

  // Determinar si estamos en login o register para ocultar el Header
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Mostrar el Header solo si no estamos en login/register */}
      {!isLoginOrRegister && <Header />}

      {/* Definición de rutas */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/uploadvideo" element={<UploadVideo />} /> {/* Ruta para UploadVideo */}
        <Route path="/profile" element={<Profile />} /> {/* Nueva ruta para Perfil */}
      </Routes>

      {/* Botón flotante para volver al inicio */}
      <ScrollToTopButton />
    </>
  );
};

// Envuelve `App` con `Router` y `AuthProvider` para el contexto y rutas
const AppWrapper: React.FC = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
