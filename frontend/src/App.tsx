import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/homepage/homepage";
import Login from "./pages/auth-pages/login";
import Register from "./pages/auth-pages/register";
import VideoPlayer from "./pages/video-player/videoPlayer";
import UploadVideo from "./pages/upload-video/uploadVideo";
import Profile from "./pages/profile/profile";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";

const App: React.FC = () => {
  const location = useLocation();

  
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {}
      {!isLoginOrRegister && <Header />}

      {}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/uploadvideo" element={<UploadVideo />} /> {}
        <Route path="/profile" element={<Profile />} /> {}
      </Routes>

      {}
      <ScrollToTopButton />
    </>
  );
};


const AppWrapper: React.FC = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
