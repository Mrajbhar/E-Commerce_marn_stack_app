import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { FaCartArrowDown } from "react-icons/fa";
import { Badge } from "antd";
import "../../styles/Header.css";
import { useTheme } from "../../pages/Themes/ThemeContext";
import { ToggleButton } from "./ToggleButton";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);

  const { darkMode } = useTheme();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-black">
          <RiShoppingBag3Fill /> ShopStar
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <SearchInput />
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setIsSubMenuOpen(true)}
              onMouseLeave={() => setIsSubMenuOpen(false)}
            >
              <Link
                className="nav-link dropdown-toggle"
                to={"/categories"}
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>
              <ul
                className={`dropdown-menu ${isSubMenuOpen ? "show" : ""}`}
                onMouseEnter={() => setIsSubMenuOpen(true)}
                onMouseLeave={() => setIsSubMenuOpen(false)}
              >
                <li>
                  <Link className="dropdown-item" to={"/categories"}>
                    All Categories
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c._id}>
                    <Link
                      className="dropdown-item"
                      to={`/category/${c.slug}`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setIsProductSubMenuOpen(true)}
              onMouseLeave={() => setIsProductSubMenuOpen(false)}
            >
              <Link
                className="nav-link dropdown-toggle"
                to={"/products"}
                data-bs-toggle="dropdown"
              >
                Products
              </Link>
              <ul
                className={`dropdown-menu ${isProductSubMenuOpen ? "show" : ""}`}
                onMouseEnter={() => setIsProductSubMenuOpen(true)}
                onMouseLeave={() => setIsProductSubMenuOpen(false)}
              >
                <li>
                  <Link className="dropdown-item" to={"/allproduct"}>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to={"/new-arrivals"}>
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to={"/best-sellers"}>
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </li>
            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {auth?.user?.name}
                  </NavLink>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                        className="dropdown-item"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className="dropdown-item"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
            <li className="nav-item">
              <Badge count={cart?.length} showZero>
                <NavLink to="/cart" className="nav-link">
                <FaCartArrowDown />
                </NavLink>
              </Badge>
            </li>
           

            
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Header;
