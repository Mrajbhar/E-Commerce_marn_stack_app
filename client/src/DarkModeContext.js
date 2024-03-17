// DarkModeContext.js
import React, { createContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Retrieve dark mode state from local storage or default to false
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  useEffect(() => {
    // Save dark mode state to local storage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export { DarkModeProvider, DarkModeContext };
