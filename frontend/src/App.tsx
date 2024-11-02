import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import VideoPlayer from "./pages/videoPlayer";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isLoginOrRegister && <Header />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
