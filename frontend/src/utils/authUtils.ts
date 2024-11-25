import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useHandleLogout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return handleLogout;
};