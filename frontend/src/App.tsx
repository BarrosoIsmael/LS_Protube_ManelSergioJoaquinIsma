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
