import React from "react";
import { Link } from "react-router-dom";
import { RiShoppingBag3Fill } from "react-icons/ri";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaArrowUp,
} from "react-icons/fa6";
import "../../styles/Footer.css";
import ToggleButton from "../../pages/Themes/ToggleButton";
import { useTheme } from "../../pages/Themes/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();
  const year = new Date().getFullYear();

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className={`footer-container ${darkMode ? "dark" : ""}`}>
      <div className="footer-accent" />
      <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
        <FaArrowUp />
      </button>

      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-brand-logo">
            <RiShoppingBag3Fill className="bag" /> MarketHub
          </Link>
          <p className="footer-tagline">
            Thoughtfully designed essentials, crafted from premium materials and
            built to last.
          </p>
          <div className="footer-socials">
            <a href="#" className="social" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="social" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="social" aria-label="Twitter"><FaXTwitter /></a>
            <a href="#" className="social" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-col">
          <h5>Shop</h5>
          <Link to="/allproduct"><span className="dot">&rarr;</span>All Products</Link>
          <Link to="/newarrivals"><span className="dot">&rarr;</span>New Arrivals</Link>
          <Link to="/bestsellers"><span className="dot">&rarr;</span>Best Sellers</Link>
          <Link to="/categories"><span className="dot">&rarr;</span>Categories</Link>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h5>Company</h5>
          <Link to="/about"><span className="dot">&rarr;</span>About</Link>
          <Link to="/contact"><span className="dot">&rarr;</span>Contact</Link>
          <Link to="/policy"><span className="dot">&rarr;</span>Privacy Policy</Link>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h5>Support</h5>
          <Link to="/contact"><span className="dot">&rarr;</span>Shipping</Link>
          <Link to="/contact"><span className="dot">&rarr;</span>Returns</Link>
          <Link to="/cart"><span className="dot">&rarr;</span>Track Order</Link>
          <Link to="/contact"><span className="dot">&rarr;</span>FAQ</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          All Rights Reserved &copy; <b>Mohan</b> {year}
        </p>
        <div className="footer-legal">
          <Link to="/about">About</Link>
          <span className="sep">&middot;</span>
          <Link to="/contact">Contact</Link>
          <span className="sep">&middot;</span>
          <Link to="/policy">Privacy Policy</Link>
          <span className="footer-toggle">
            <ToggleButton />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
