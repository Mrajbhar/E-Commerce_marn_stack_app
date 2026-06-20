import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { FiUser, FiHeart, FiShoppingCart, FiChevronDown } from "react-icons/fi";
import { Badge } from "antd";
import "../../styles/Header.css";
import { useTheme } from "../../pages/Themes/ThemeContext";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const { darkMode } = useTheme();
  const [userOpen, setUserOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <header className={`site-header ${darkMode ? "dark" : ""}`}>
      {/* announcement strip */}
      <div className="hd-strip">
        Free express shipping this weekend on orders over &#8377;999
      </div>

      {/* tier 1 — logo / search / actions */}
      <div className="hd-top">
        <Link to="/" className="hd-logo">
          <RiShoppingBag3Fill className="bag" /> MarketHub
        </Link>

        <div className="hd-search">
          <SearchInput />
        </div>

        <div className="hd-acts">
          {!auth?.user ? (
            <>
              <NavLink to="/login" className="hd-act">
                <FiUser className="big" />
                <span>Login</span>
              </NavLink>
              <NavLink to="/register" className="hd-act hd-act-cta">
                <span>Register</span>
              </NavLink>
            </>
          ) : (
            <div
              className="hd-user"
              onMouseEnter={() => setUserOpen(true)}
              onMouseLeave={() => setUserOpen(false)}
            >
              <button className="hd-act hd-user-btn">
                <span className="hd-avatar">
                  {auth?.user?.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hd-user-name">
                  {auth?.user?.name?.split(" ")[0]}
                </span>
                <FiChevronDown size={14} />
              </button>
              <ul className={`hd-dropdown ${userOpen ? "show" : ""}`}>
                <li>
                  <NavLink
                    to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/user/orders">Orders</NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout} to="/login">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          <NavLink to="/cart" className="hd-act">
            <Badge count={cart?.length} showZero size="small" color="#1d4ed8">
              <FiShoppingCart className="big" />
            </Badge>
            <span>Cart</span>
          </NavLink>
        </div>

        {/* mobile toggle */}
        <button
          className="hd-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* tier 2 — category ribbon */}
      <nav className={`hd-ribbon ${mobileOpen ? "open" : ""}`}>
        <NavLink to="/" className="rb-link">
          Home
        </NavLink>

        <div
          className="rb-cat"
          onMouseEnter={() => setCatOpen(true)}
          onMouseLeave={() => setCatOpen(false)}
        >
          <Link to="/categories" className="rb-link">
            All Categories <FiChevronDown size={13} />
          </Link>
          <ul className={`rb-dropdown ${catOpen ? "show" : ""}`}>
            <li>
              <Link to="/categories">All Categories</Link>
            </li>
            {categories?.map((c) => (
              <li key={c._id}>
                <Link to={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {categories?.slice(0, 5).map((c) => (
          <NavLink key={c._id} to={`/category/${c.slug}`} className="rb-link">
            {c.name}
          </NavLink>
        ))}

        <NavLink to="/allproduct" className="rb-link">
          All Products
        </NavLink>
        <NavLink to="/newarrivals" className="rb-link">
          New Arrivals
        </NavLink>
        <NavLink to="/bestsellers" className="rb-link rb-sale">
          Best Sellers
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
