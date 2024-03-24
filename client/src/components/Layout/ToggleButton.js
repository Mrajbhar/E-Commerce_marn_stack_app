// ToggleButton.js
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import { useTheme } from '../../pages/Themes/ThemeContext';

const ToggleButton = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button className="toggle-button" onClick={toggleDarkMode}>
      {darkMode ? <FaSun /> : <FaMoon />} {/* Use icons to represent dark and light mode */}
    </button>
  );
};

export { ToggleButton };
