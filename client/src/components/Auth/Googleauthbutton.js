import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/auth";

/**
 * Custom-styled Google sign-in button (cobalt theme).
 * Styles are inline so they always apply regardless of CSS load order.
 * NOTE: the "or" divider lives in Login.js / Register.js now, so this
 * component renders only the button to avoid a duplicate divider.
 */
const GoogleAuthButton = () => {
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/auth/google-login`,
          { access_token: tokenResponse.access_token },
        );
        if (data?.success) {
          toast.success(data.message || "Logged in with Google");
          setAuth({ ...auth, user: data.user, token: data.token });
          localStorage.setItem("auth", JSON.stringify(data));
          navigate(location.state || "/");
        } else {
          toast.error(data?.message || "Google login failed");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google sign-in was cancelled or failed"),
  });

  // ---- inline styles (cobalt, self-contained) ----
  const buttonStyle = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontWeight: 700,
    fontSize: "0.95rem",
    lineHeight: 1,
    padding: "14px 24px",
    borderRadius: "999px",
    border: `1.5px solid ${hover ? "#1d4ed8" : "#e3e6ee"}`,
    background: "#ffffff",
    color: "#0e1726",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    boxShadow: hover
      ? "0 8px 22px rgba(29,78,216,0.15)"
      : "0 1px 2px rgba(10,31,68,0.05)",
    transform: hover ? "translateY(-1px)" : "translateY(0)",
    transition:
      "border-color .2s, box-shadow .2s, transform .2s, background .2s",
  };

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={loading}
      style={buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FcGoogle size={20} style={{ flexShrink: 0, display: "block" }} />
      {loading ? "Signing in…" : "Continue with Google"}
    </button>
  );
};

export default GoogleAuthButton;
