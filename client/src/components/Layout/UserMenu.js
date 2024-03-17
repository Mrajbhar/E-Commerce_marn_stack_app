import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/UserMenu.css";

const UserMenu = () => {
  return (
    <div className="user-menu-container">
      <div className="text-center">
        <div className="list-group">
          <h4>Dashboard</h4>
          <NavLink
            to="/dashboard/User/profile"
            className="list-group-item list-group-item-action"
            activeClassName="active"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/User/orders"
            className="list-group-item list-group-item-action"
            activeClassName="active"
          >
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
