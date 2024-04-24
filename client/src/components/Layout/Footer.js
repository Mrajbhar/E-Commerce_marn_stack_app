import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css"
import DarkModeToggle from "./DarkModeToggle";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <h4 className="footer-text">
          All Rights Reserved &copy; Mohan
        </h4>
        <p className="footer-links">
          <Link to="/about" className="footer-link">About</Link>
          <span className="divider">|</span>
          <Link to="/contact" className="footer-link">Contact</Link>
          <span className="divider">|</span>
          <Link to="/policy" className="footer-link">Privacy Policy</Link>
          <span className="divider">|</span>
          <DarkModeToggle />
        </p>
        
      </div>
    </div>
  );
};

export default Footer;
