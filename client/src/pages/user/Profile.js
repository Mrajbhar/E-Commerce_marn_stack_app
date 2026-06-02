import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { TbUserEdit } from "react-icons/tb";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const { darkMode } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const { email, name, phone, address } = auth?.user || {};
    setName(name || "");
    setPhone(phone || "");
    setEmail(email || "");
    setAddress(address || "");
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        { name, email, password, phone, address }
      );
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <UserMenu />
          </aside>

          <main>
            <h1 className="dash-heading">
              <TbUserEdit />
              Edit Profile
            </h1>

            <div className="dash-form-card" style={{ maxWidth: "100%" }}>
              <p className="dash-card-sub" style={{ margin: "0 0 18px" }}>
                Update your account details. Leave the password blank to keep
                it unchanged.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="dash-form-grid">
                  <div className="dash-field">
                    <label className="dash-label">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="dash-input"
                      placeholder="Your full name"
                      autoFocus
                    />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="dash-input"
                      placeholder="you@example.com"
                      disabled
                    />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="dash-input"
                      placeholder="+91 …"
                    />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label">New password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="dash-input"
                      placeholder="Leave blank to keep current"
                    />
                  </div>

                  <div className="dash-field full">
                    <label className="dash-label">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="dash-input"
                      placeholder="House no, street, city, postal code"
                    />
                  </div>

                  <div className="dash-field full dash-submit-row">
                    <button type="submit" className="dash-btn-create">
                      <TbUserEdit /> Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;