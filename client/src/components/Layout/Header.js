import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { FiUser, FiShoppingCart, FiHeart, FiChevronDown } from "react-icons/fi";
import { Badge } from "antd";
import "../../styles/Header.css";
import { useTheme } from "../../pages/Themes/ThemeContext";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [wishlist] = useWishlist();
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

  // close the mobile menu (call after navigating)
  const closeMenu = () => {
    setMobileOpen(false);
    setCatOpen(false);
  };

  const dashboardPath = `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`;

  return (
    <header className={`site-header ${darkMode ? "dark" : ""}`}>
      {/* announcement strip */}
      <div className="hd-strip">
        Free express shipping this weekend on orders over &#8377;999
      </div>

      {/* tier 1 — logo / search / actions */}
      <div className="hd-top">
        <Link to="/" className="hd-logo" onClick={closeMenu}>
          <RiShoppingBag3Fill className="bag" /> MarketHub
        </Link>

        <div className="hd-search">
          <SearchInput />
        </div>

        <div className="hd-acts">
          {!auth?.user ? (
            <>
              <NavLink to="/login" className="hd-act hd-act-login">
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
              {/* onClick added so it also works on touch devices */}
              <button
                className="hd-act hd-user-btn"
                onClick={() => setUserOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={userOpen}
              >
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
                    to={dashboardPath}
                    onClick={() => setUserOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/user/orders"
                    onClick={() => setUserOpen(false)}
                  >
                    Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout} to="/login">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          {/* wishlist */}
          <NavLink to="/wishlist" className="hd-act hd-act-wish">
            <Badge
              count={wishlist?.length}
              showZero
              size="small"
              color="#1d4ed8"
            >
              <FiHeart className="big" />
            </Badge>
            <span>Wishlist</span>
          </NavLink>

          <NavLink to="/cart" className="hd-act hd-act-cart">
            <Badge count={cart?.length} showZero size="small" color="#1d4ed8">
              <FiShoppingCart className="big" />
            </Badge>
            <span>Cart</span>
          </NavLink>

          {/* mobile toggle — moved inside acts so it sits on the right */}
          <button
            className="hd-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={mobileOpen ? "x1" : ""} />
            <span className={mobileOpen ? "x2" : ""} />
            <span className={mobileOpen ? "x3" : ""} />
          </button>
        </div>
      </div>

      {/* backdrop for mobile menu */}
      <div
        className={`hd-backdrop ${mobileOpen ? "show" : ""}`}
        onClick={closeMenu}
      />

      {/* tier 2 — category ribbon (becomes slide-down menu on mobile) */}
      <nav className={`hd-ribbon ${mobileOpen ? "open" : ""}`}>
        <NavLink to="/" className="rb-link" onClick={closeMenu}>
          Home
        </NavLink>

        <div
          className="rb-cat"
          onMouseEnter={() => setCatOpen(true)}
          onMouseLeave={() => setCatOpen(false)}
        >
          {/* tap toggles the submenu on mobile */}
          <button
            type="button"
            className="rb-link rb-cat-toggle"
            onClick={() => setCatOpen((v) => !v)}
            aria-expanded={catOpen}
          >
            All Categories <FiChevronDown size={13} />
          </button>
          <ul className={`rb-dropdown ${catOpen ? "show" : ""}`}>
            <li>
              <Link to="/categories" onClick={closeMenu}>
                All Categories
              </Link>
            </li>
            {categories?.map((c) => (
              <li key={c._id}>
                <Link to={`/category/${c.slug}`} onClick={closeMenu}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {categories?.slice(0, 5).map((c) => (
          <NavLink
            key={c._id}
            to={`/category/${c.slug}`}
            className="rb-link rb-cat-inline"
            onClick={closeMenu}
          >
            {c.name}
          </NavLink>
        ))}

        <NavLink to="/allproduct" className="rb-link" onClick={closeMenu}>
          All Products
        </NavLink>
        <NavLink to="/newarrivals" className="rb-link" onClick={closeMenu}>
          New Arrivals
        </NavLink>
        <NavLink
          to="/bestsellers"
          className="rb-link rb-sale"
          onClick={closeMenu}
        >
          Best Sellers
        </NavLink>

        {/* account links — only shown inside the mobile menu */}
        <div className="rb-account">
          <NavLink to="/wishlist" onClick={closeMenu}>
            Wishlist ({wishlist?.length || 0})
          </NavLink>
          {!auth?.user ? (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={dashboardPath} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/user/orders" onClick={closeMenu}>
                Orders
              </NavLink>
              <button
                type="button"
                className="rb-logout"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
