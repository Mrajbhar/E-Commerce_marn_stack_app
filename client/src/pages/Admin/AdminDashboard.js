import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { useTheme } from "../Themes/ThemeContext";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const { darkMode } = useTheme();

  const initial = auth?.user?.name?.charAt(0)?.toUpperCase() || "A";

  const details = [
    { icon: <FiUser />, label: "Admin name", value: auth?.user?.name || "—" },
    { icon: <FiMail />, label: "Email address", value: auth?.user?.email || "—" },
    { icon: <FiPhone />, label: "Contact", value: auth?.user?.phone || "—" },
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          {/* Main */}
          <main>
            {/* Profile header */}
            <div className="dash-header">
              <div className="dash-avatar">{initial}</div>
              <div className="dash-header-info">
                <span className="dash-role-chip">Administrator</span>
                <h1 className="dash-name">{auth?.user?.name}</h1>
                <p className="dash-email">{auth?.user?.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="dash-card">
              <h2 className="dash-card-title">Account Details</h2>
              <p className="dash-card-sub">Your administrator profile information.</p>
              <div className="dash-grid">
                {details.map((d, i) => (
                  <div className="dash-tile" key={i}>
                    <div className="dash-tile-ico">{d.icon}</div>
                    <p className="dash-tile-label">{d.label}</p>
                    <p className="dash-tile-value">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
