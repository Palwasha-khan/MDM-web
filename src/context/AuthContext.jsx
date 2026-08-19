import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, logoutRequest, refreshRequest ,getMe} from "../api/endpoints/authApi";
import axiosClient, { setAccessToken, rawAxios } from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
 
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await rawAxios.post("/auth/refresh-token");
        setAccessToken(data.accessToken);

        const meResponse = await getMe();
        setAdmin(meResponse.data.user);
      } catch (err) {
        setAccessToken(null);
        setAdmin(null);
      } finally {
        setCheckingSession(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await loginRequest(email, password);
      setAccessToken(data.accessToken);
      setAdmin(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) { 
    }
    setAccessToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, error, loading, checkingSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}