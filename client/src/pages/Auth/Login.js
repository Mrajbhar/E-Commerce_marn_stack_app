import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
import { RiShoppingBag3Fill } from "react-icons/ri";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
} from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";
import GoogleAuthButton from "../../components/Auth/Googleauthbutton";

const Login = () => {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        { email, password },
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Ecommerce App">
      <div className={`auth-page ${darkMode ? "dark" : ""}`}>
        <div className="auth-card">
          <aside className="auth-aside">
            <Link to="/" className="auth-logo">
              <RiShoppingBag3Fill /> MarketHub
            </Link>
            <div>
              <h2>Welcome back.</h2>
              <p className="aside-lead">
                Sign in to track orders, save favourites, and check out faster.
              </p>
              <div className="auth-perks">
                <div>
                  <span className="pk">⛟</span> Free shipping over ₹999
                </div>
                <div>
                  <span className="pk">↺</span> 30-day easy returns
                </div>
                <div>
                  <span className="pk">★</span> Members-only offers
                </div>
              </div>
            </div>
          </aside>

          <div className="auth-form-side">
            <form onSubmit={handleSubmit}>
              <span className="auth-kicker">Account</span>
              <h4 className="title">Login</h4>
              <p className="auth-lead">
                Enter your details to access your account.
              </p>

              <div className="auth-field">
                <span className="ico">
                  <FiMail />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEamil(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="auth-field">
                <span className="ico">
                  <FiLock />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) =>
                    setCapsOn(
                      e.getModifierState && e.getModifierState("CapsLock"),
                    )
                  }
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {capsOn && (
                <div className="caps-warn">
                  <FiAlertTriangle /> Caps Lock is on
                </div>
              )}

              <div className="auth-row">
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn-primary">
                LOGIN
              </button>

              <div className="auth-or">or</div>

              <GoogleAuthButton />

              <p className="auth-switch">
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
