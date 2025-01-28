import Cookies from "js-cookie";
import {
  verifyToken as apiVerifyToken,
  login as apiLogin,
  logout as apiLogout,
} from "../api/authApi";

const login = async (email, password) => {
  try {
    const data = await apiLogin(email, password);
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await apiLogout();
    Cookies.remove("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const verifyToken = async () => {
  const token = Cookies.get("token");
  if (token) {
    try {
      const data = await apiVerifyToken();
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Token no válido o sesión caducada:", error);
      Cookies.remove("token");
      localStorage.removeItem("user");
    }
  }
};

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getToken = () => {
  return Cookies.get("token");
};

export const useAuth = () => {
  return {
    login,
    logout,
    verifyToken,
    getUser,
    getToken,
  };
};
