import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // First visit: use saved choice, else fall back to the OS preference
  const getInitial = () => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
  };

  const [darkMode, setDarkMode] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    // Apply on both <html> and <body> so global + scoped styles all react,
    // covering `.dark` (html) and `.dark-mode` (body/page) conventions.
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
