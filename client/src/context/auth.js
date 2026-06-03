import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Restore session from localStorage on first mount
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setAuth((prev) => ({
          ...prev,
          user: parsed.user,
          token: parsed.token,
        }));
      } catch (err) {
        // corrupted storage — clear it
        localStorage.removeItem("auth");
      }
    }
    // eslint-disable-next-line
  }, []);

  // Keep the axios Authorization header in sync with the CURRENT token.
  // This runs whenever auth.token changes (including right after restore),
  // so protected API calls always carry the latest token.
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };