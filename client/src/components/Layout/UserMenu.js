import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/UserMenu.css";
import { CgProfile } from "react-icons/cg";
import { TbUser, TbTruck } from "react-icons/tb";

const UserMenu = () => {
  const items = [
    { to: "/dashboard/User/profile", icon: <TbUser />, label: "Profile" },
    { to: "/dashboard/User/orders", icon: <TbTruck />, label: "Orders" },
  ];

  return (
    <div className="user-menu-container">
      <div className="list-group">
        <h4>
          <CgProfile /> Dashboard
        </h4>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="list-group-item list-group-item-action"
          >
            <span className="user-menu-ico">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default UserMenu;
