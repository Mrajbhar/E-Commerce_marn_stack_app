// ToggleButton.js
import React from 'react';
import { useTheme } from "../Themes/ThemeContext";

const ToggleButton = () => {
  const { darkMode, toggleDarkMode } = useTheme(); // Corrected destructuring

  return (
    <button className={`toggle-button ${darkMode ? 'dark' : ''}`} onClick={toggleDarkMode}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export { ToggleButton };
