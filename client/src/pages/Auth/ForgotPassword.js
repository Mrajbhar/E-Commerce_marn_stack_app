import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { FiMail, FiHelpCircle, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        { email, newPassword, answer },
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Forgot Password - Ecommerce App"}>
      <div className={`auth-page ${darkMode ? "dark" : ""}`}>
        <div className="auth-card">
          <aside className="auth-aside">
            <Link to="/" className="auth-logo">
              <RiShoppingBag3Fill /> MarketHub
            </Link>
            <div>
              <h2>Forgot your password?</h2>
              <p className="aside-lead">
                No worries. Verify your security answer and set a new password
                in seconds.
              </p>
              <div className="auth-perks">
                <div>
                  <span className="pk">🔒</span> Your data stays secure
                </div>
                <div>
                  <span className="pk">↺</span> Quick & simple reset
                </div>
              </div>
            </div>
          </aside>

          <div className="auth-form-side">
            <form onSubmit={handleSubmit}>
              <span className="auth-kicker">Recover</span>
              <h4 className="title">Reset password</h4>
              <p className="auth-lead">
                Confirm your details to set a new password.
              </p>

              <div className="auth-field">
                <span className="ico">
                  <FiMail />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="auth-field">
                <span className="ico">
                  <FiHelpCircle />
                </span>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="form-control"
                  placeholder="Favourite sport (security answer)"
                  required
                />
              </div>

              <div className="auth-field">
                <span className="ico">
                  <FiLock />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  placeholder="New password"
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

              <button type="submit" className="btn-primary">
                RESET PASSWORD
              </button>

              <p className="auth-switch">
                Remembered it? <Link to="/login">Back to login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;
