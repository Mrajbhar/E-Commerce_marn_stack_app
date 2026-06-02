import React from "react";
import { NavLink } from "react-router-dom";
import {
  TbLayoutDashboardFilled,
  TbCategoryFilled,
  TbBox,
  TbBoxMultiple,
  TbPhotoEdit,
  TbReceipt,
  TbUsers,
} from "react-icons/tb";

const items = [
  { to: "/dashboard/admin", end: true, label: "Dashboard", icon: <TbLayoutDashboardFilled /> },
  { to: "/dashboard/admin/create-category", label: "Create Category", icon: <TbCategoryFilled /> },
  { to: "/dashboard/admin/create-product",  label: "Create Product",  icon: <TbBox /> },
  { to: "/dashboard/admin/products",        label: "Products",        icon: <TbBoxMultiple /> },
  { to: "/dashboard/admin/Banners",         label: "Banners",         icon: <TbPhotoEdit /> },
  { to: "/dashboard/admin/orders",          label: "Orders",          icon: <TbReceipt /> },
  { to: "/dashboard/admin/users",           label: "Users",           icon: <TbUsers /> },
];

const AdminMenu = () => {
  return (
    <div className="list-group">
      <h4>Admin Panel</h4>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, display: "grid", placeItems: "center" }}>
              {it.icon}
            </span>
            {it.label}
          </span>
        </NavLink>
      ))}
    </div>
  );
};

export default AdminMenu;
