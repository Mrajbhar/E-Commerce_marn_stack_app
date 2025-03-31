import { useTheme } from "./ThemeContext"; 
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ToggleButton() {
  const { darkMode, toggleDarkMode } = useTheme();
  console.log("Dark Mode:", darkMode); // Debugging

  return (
    <motion.div
      className={`relative flex items-center w-28 h-14 rounded-full cursor-pointer transition-all duration-500 
        ${darkMode ? "bg-gray-900 shadow-lg" : "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 shadow-md"}`}
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.9 }}
    >
      {/* Background Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-full blur-lg transition-opacity duration-500 
          ${darkMode ? "bg-blue-700 opacity-40" : "bg-yellow-400 opacity-30"}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Toggle Ball */}
      <motion.div
        className={`absolute w-12 h-12 rounded-full flex items-center justify-center 
          transition-all border-2 
          ${darkMode ? "border-gray-700 bg-yellow-400" : "border-yellow-400 bg-gray-900"}`} /* Fixed */
        animate={{ x: darkMode ? 50 : 4 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >
        {darkMode ? (
          <Sun className="w-7 h-7 text-gray-900" />  // Fixed icon color
        ) : (
          <Moon className="w-7 h-7 text-yellow-400" />  // Fixed icon color
        )}
      </motion.div>
    </motion.div>
  );
}
