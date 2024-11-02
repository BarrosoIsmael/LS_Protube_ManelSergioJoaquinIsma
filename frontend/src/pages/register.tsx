import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Register: React.FC = () => {
  const navigate = useNavigate(); // Hook para redirigir al usuario
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
        navigate("/"); // Redirige a la página de inicio si el registro es exitoso
      } else {
        setError(await response.text());
      }
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
    }
  };

  return <AuthForm title="Register" buttonText="Register" onSubmit={handleRegister} error={error} />;
};

export default Register;
