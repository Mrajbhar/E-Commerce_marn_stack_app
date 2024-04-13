import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import {toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data when the component mounts
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

      const updatedUsers = users.map((user) => {
        if (user._id === updatedUser._id) {
          return updatedUser;
        }
        return user;
        
      });
      setUsers(updatedUsers);

      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/update-user/${userId}`,
        { role: newRole }
      );
      const updatedUser = response.data.user;
      const updatedUsers = users.map((user) => {
        if (user._id === updatedUser._id) {
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers);
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    }
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, parseInt(e.target.value))
                        }
                      >
                        <option value={0}>User</option>
                        <option value={1}>Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleUpdateClick(user._id, user.role)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
