import {
  verifyToken as apiVerifyToken,
  login as apiLogin,
  logout as apiLogout,
} from "../api/authApi";

const login = async (email, password) => {
  try {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await apiLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const data = await apiVerifyToken();
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Token no válido o sesión caducada:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
};

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getToken = () => {
  return localStorage.getItem("token");
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
