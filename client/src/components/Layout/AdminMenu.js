import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Adminmenu.css";
import { CgProfile } from "react-icons/cg";
import {
  TbCategoryPlus,
  TbBox,
  TbShoppingBag,
  TbTruck,
  TbUsers,
} from "react-icons/tb";

const AdminMenu = () => {
  const items = [
    { to: "/dashboard/admin/create-category", icon: <TbCategoryPlus />, label: "Create Category" },
    { to: "/dashboard/admin/create-product", icon: <TbBox />, label: "Create Product" },
    { to: "/dashboard/admin/products", icon: <TbShoppingBag />, label: "Products" },
    { to: "/dashboard/admin/orders", icon: <TbTruck />, label: "Orders" },
    { to: "/dashboard/admin/users", icon: <TbUsers />, label: "Users" },
  ];

  return (
    <div className="admin-menu-container">
      <div className="admin-menu-header">
        <h4>
          <CgProfile /> Admin Panel
        </h4>
      </div>
      <div className="admin-menu-items">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="admin-menu-item">
            <span className="admin-menu-ico">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;