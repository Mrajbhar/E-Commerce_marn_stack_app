import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { RiShoppingBag3Fill } from "react-icons/ri";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiHelpCircle,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
} from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";
import GoogleAuthButton from "../../components/Auth/Googleauthbutton";

// Simple password strength: length + variety of character classes.
const scorePassword = (pw) => {
  let s = 0;
  if (!pw) return 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(3, s); // 0..3
};
const strengthMeta = ["", "weak", "medium", "strong"];
const strengthLabel = [
  "",
  "Weak password",
  "Medium strength",
  "Strong password",
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const strength = scorePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, address, answer },
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      if (value === "" || value.length <= 10) setPhone(value);
    }
  };

  return (
    <Layout title="Register - Ecommerce App">
      <div className={`auth-page ${darkMode ? "dark" : ""}`}>
        <div className="auth-card">
          <aside className="auth-aside">
            <Link to="/" className="auth-logo">
              <RiShoppingBag3Fill /> MarketHub
            </Link>
            <div>
              <h2>Join the club.</h2>
              <p className="aside-lead">
                Create an account for faster checkout, order tracking, and
                exclusive member offers.
              </p>
              <div className="auth-perks">
                <div>
                  <span className="pk">★</span> 10% off your first order
                </div>
                <div>
                  <span className="pk">⛟</span> Free shipping over ₹999
                </div>
                <div>
                  <span className="pk">♥</span> Save your favourites
                </div>
              </div>
            </div>
          </aside>

          <div className="auth-form-side">
            <form onSubmit={handleSubmit}>
              <span className="auth-kicker">Get started</span>
              <h4 className="title">Create account</h4>
              <p className="auth-lead">It only takes a minute.</p>

              <div className="auth-field">
                <span className="ico">
                  <FiUser />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="auth-field">
                <span className="ico">
                  <FiMail />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Email"
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
                  placeholder="Password"
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

              {password && (
                <div className={`pw-meter pw-${strengthMeta[strength]}`}>
                  <div className="pw-meter-track">
                    <div className="pw-meter-fill" />
                  </div>
                  <div className="pw-meter-label">
                    {strengthLabel[strength]}
                  </div>
                </div>
              )}

              <div className="auth-grid">
                <div className="auth-field">
                  <span className="ico">
                    <FiPhone />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="form-control"
                    placeholder="Phone"
                    maxLength={10}
                    required
                  />
                </div>
                <div className="auth-field">
                  <span className="ico">
                    <FiMapPin />
                  </span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    placeholder="Address"
                    required
                  />
                </div>
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

              <button type="submit" className="btn-primary">
                REGISTER
              </button>

              <div className="auth-or">or</div>

              <GoogleAuthButton />

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
