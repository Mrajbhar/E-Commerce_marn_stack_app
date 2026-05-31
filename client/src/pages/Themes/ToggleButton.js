import { useTheme } from "./ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/ToggleButton.css";

export default function ToggleButton() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      type="button"
      className={`theme-toggle ${darkMode ? "is-dark" : "is-light"}`}
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.92 }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      {/* soft glow */}
      <motion.span
        className="theme-toggle__glow"
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* static track icons */}
      <span className="theme-toggle__icon theme-toggle__icon--sun">
        <Sun size={15} />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--moon">
        <Moon size={15} />
      </span>

      {/* sliding knob */}
      <motion.span
        className="theme-toggle__knob"
        animate={{ x: darkMode ? 30 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        {darkMode ? <Moon size={15} /> : <Sun size={15} />}
      </motion.span>
    </motion.button>
  );
}
