import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { TbUsers } from "react-icons/tb";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-users`
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdateClick = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/update-user/${userId}`,
        { role: newRole }
      );
      const updatedUser = response.data.user;
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user role");
    }
  };

  // Optimistic local change of the select so the user sees the new value
  // immediately; the actual save happens on Update click.
  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );
  };

  const initialOf = (name) =>
    (name?.trim()?.charAt(0) || "?").toUpperCase();

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          {/* Main */}
          <main>
            <div className="dash-head-row">
              <h1 className="dash-heading" style={{ margin: 0 }}>
                <TbUsers />
                All Users
              </h1>
              <span className="dash-count">
                <b>{users.length}</b> user{users.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="dash-table-card">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Name</th>
                    <th className="col-hide-sm">Email</th>
                    <th>Role</th>
                    <th>Change role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td className="dash-empty-row" colSpan={6}>
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td className="dash-cell-num">{index + 1}</td>
                        <td>
                          <div className="dash-user-cell">
                            <div className="dash-user-avatar">
                              {initialOf(user.name)}
                            </div>
                            <span className="dash-user-name" title={user.name}>
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="dash-cell-email col-hide-sm">
                          {user.email}
                        </td>
                        <td>
                          <span
                            className={`dash-role-pill ${
                              user.role === 1 ? "admin" : "user"
                            }`}
                          >
                            {user.role === 1 ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>
                          <select
                            className="dash-native-select"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                parseInt(e.target.value)
                              )
                            }
                          >
                            <option value={0}>User</option>
                            <option value={1}>Admin</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="dash-btn-sm dash-btn-edit"
                            onClick={() =>
                              handleUpdateClick(user._id, user.role)
                            }
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
