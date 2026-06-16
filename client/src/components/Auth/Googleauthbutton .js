import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/auth";

/**
 * Custom-styled Google sign-in button.
 * Styles are inline so they always apply regardless of CSS load order.
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
          { access_token: tokenResponse.access_token }
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

  // ---- inline styles (self-contained, no external CSS needed) ----
  const dividerWrap = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    margin: "18px 0",
    color: "#9a9088",
    fontSize: "0.78rem",
  };
  const dividerLine = { flex: 1, height: "1px", background: "#e8e1d6" };
  const dividerText = {
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
    flexShrink: 0,
  };

  const buttonStyle = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
    fontWeight: 600,
    fontSize: "0.95rem",
    lineHeight: 1,
    padding: "14px 24px",
    borderRadius: "12px",
    border: `1.5px solid ${hover ? "#c8bfb1" : "#e3ddd3"}`,
    background: "#ffffff",
    color: "#2b2620",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    boxShadow: hover
      ? "0 6px 18px rgba(26,23,20,0.10)"
      : "0 1px 2px rgba(26,23,20,0.04)",
    transform: hover ? "translateY(-1px)" : "translateY(0)",
    transition:
      "border-color .2s, box-shadow .2s, transform .2s, background .2s",
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={dividerWrap}>
        <span style={dividerLine} />
        <span style={dividerText}>or</span>
        <span style={dividerLine} />
      </div>

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
    </div>
  );
};

export default GoogleAuthButton;