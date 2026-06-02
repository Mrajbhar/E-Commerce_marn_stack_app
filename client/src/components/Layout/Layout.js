import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../../pages/Themes/ThemeContext";

const Layout = ({
  children,
  title = "MarketHub — shop the new season",
  description = "Discover thoughtfully designed essentials at MarketHub. Free shipping on orders over ₹999, 30-day easy returns.",
  keywords = "ecommerce, online shopping, fashion, apparel, accessories, home, beauty, MarketHub",
  author = "MarketHub",
  image = "/og-cover.jpg",
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta name="theme-color" content={darkMode ? "#16130f" : "#faf7f2"} />
        <title>{title}</title>

        {/* Open Graph (Facebook, WhatsApp, LinkedIn, etc.) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="MarketHub" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <Header />

      <main style={{ minHeight: "70vh" }}>{children}</main>

      <Footer />

      {/* Toasts live at the root so they sit above sticky/fixed UI, and they
          pick up the current theme tokens automatically. */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface, #fff)",
            color: "var(--ink, #1a1714)",
            border: "1px solid var(--line, #e8e1d6)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
            fontSize: "0.92rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          },
          success: { iconTheme: { primary: "#c2562f", secondary: "#fff" } },
          error: { iconTheme: { primary: "#c0392b", secondary: "#fff" } },
        }}
      />
    </div>
  );
};

export default Layout;