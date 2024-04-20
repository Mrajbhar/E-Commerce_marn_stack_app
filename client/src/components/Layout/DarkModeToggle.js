import React from "react";
import { useTheme } from "../../pages/Themes/ThemeContext";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import "../../styles/DarkModeToggle.css"; // Import your CSS file for custom styling

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
      {darkMode ? <RiSunFill className="icon sun" /> : <RiMoonClearFill className="icon moon" />}
    </button>
  );
};

export default DarkModeToggle;
