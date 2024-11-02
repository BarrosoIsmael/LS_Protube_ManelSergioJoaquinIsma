import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login: React.FC = () => {
  const navigate = useNavigate(); // Asegúrate de que esté dentro del componente
  const [error, setError] = useState("");

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
      });
      if (response.ok) navigate("/"); // Redirige a la página de inicio si el login es exitoso
      else setError(await response.text());
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return <AuthForm title="Login" buttonText="Login" onSubmit={handleLogin} error={error} />;
};

export default Login;
