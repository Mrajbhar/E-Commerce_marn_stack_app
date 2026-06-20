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
import {
  TbTruckDelivery,
  TbArrowBackUp,
  TbLock,
  TbHeadset,
} from "react-icons/tb";
import "../../styles/Footer.css";
import ToggleButton from "../../pages/Themes/ToggleButton";
import { useTheme } from "../../pages/Themes/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();
  const year = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const trust = [
    {
      icon: <TbTruckDelivery />,
      title: "Free Shipping",
      text: "On orders over \u20B9999",
    },
    {
      icon: <TbArrowBackUp />,
      title: "Easy Returns",
      text: "30-day money back",
    },
    { icon: <TbLock />, title: "Secure Payment", text: "Encrypted checkout" },
    { icon: <TbHeadset />, title: "24/7 Support", text: "Always here to help" },
  ];

  return (
    <footer className={`footer-container ${darkMode ? "dark" : ""}`}>
      <button
        className="back-to-top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>

      {/* trust badge row */}
      <div className="ft-trust">
        {trust.map((t, i) => (
          <div className="ft-trust-item" key={i}>
            <span className="ft-trust-ico">{t.icon}</span>
            <div>
              <h6>{t.title}</h6>
              <p>{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* main columns */}
      <div className="ft-grid">
        <div className="ft-brand">
          <Link to="/" className="ft-logo">
            <RiShoppingBag3Fill className="bag" /> MarketHub
          </Link>
          <p className="ft-tagline">
            Thoughtfully designed essentials, crafted from premium materials and
            built to last.
          </p>
          <div className="ft-socials">
            <a href="#" className="ft-social" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="ft-social" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="ft-social" aria-label="Twitter">
              <FaXTwitter />
            </a>
            <a href="#" className="ft-social" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="ft-col">
          <h5>Shop</h5>
          <Link to="/allproduct">All Products</Link>
          <Link to="/newarrivals">New Arrivals</Link>
          <Link to="/bestsellers">Best Sellers</Link>
          <Link to="/categories">Categories</Link>
        </div>

        <div className="ft-col">
          <h5>Support</h5>
          <Link to="/contact">Shipping</Link>
          <Link to="/contact">Returns</Link>
          <Link to="/cart">Track Order</Link>
          <Link to="/contact">FAQ</Link>
        </div>

        <div className="ft-col">
          <h5>Company</h5>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </div>
      </div>

      {/* bottom bar */}
      <div className="ft-bottom">
        <p className="ft-copy">
          All Rights Reserved &copy; <b>Mohan</b> {year}
        </p>
        <div className="ft-legal">
          <Link to="/about">About</Link>
          <span className="sep">&middot;</span>
          <Link to="/contact">Contact</Link>
          <span className="sep">&middot;</span>
          <Link to="/policy">Privacy Policy</Link>
          <span className="ft-toggle">
            <ToggleButton />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
