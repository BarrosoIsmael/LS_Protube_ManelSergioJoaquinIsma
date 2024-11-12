import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import VideoPlayer from "./pages/videoPlayer";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTopButton from "./components/ScrollToTopButton";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Mostrar el Header solo si no estamos en las páginas de login o register */}
      {!isLoginOrRegister && <Header />}
      
      {/* Rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
      </Routes>

      {/* Botón flotante para volver al inicio */}
      <ScrollToTopButton />
    </>
  );
};

// Envuelve `App` con `Router` y `AuthProvider`
const AppWrapper: React.FC = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
