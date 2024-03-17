import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Adminmenu.css"
import { CgProfile } from "react-icons/cg";


const AdminMenu = () => {
  return (
    <div className="admin-menu-container">
      <div className="admin-menu-header">
        <h4> <CgProfile />Admin Panel</h4>
      </div>
      <div className="admin-menu-items">
        <NavLink
          to="/dashboard/admin/create-category"
          className="admin-menu-item"
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className="admin-menu-item"
        >
          Create Product
        </NavLink>
        <NavLink to="/dashboard/admin/products" className="admin-menu-item">
          Products
        </NavLink>
        <NavLink to="/dashboard/admin/orders" className="admin-menu-item">
          Orders
        </NavLink>
        <NavLink to="/dashboard/admin/users" className="admin-menu-item">
          Users
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;