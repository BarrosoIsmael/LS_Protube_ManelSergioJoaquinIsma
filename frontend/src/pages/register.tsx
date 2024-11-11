import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import "../App.css"; // Importa el archivo CSS

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
      });
      if (response.ok) {
        login(username); // Iniciar sesión automáticamente después de registrarse
        navigate("/");
      } else {
        setError(await response.text());
      }
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="auth-background">
      <AuthForm title="Register" buttonText="Register" onSubmit={handleRegister} error={error} />
    </div>
  );
};

export default Register;
