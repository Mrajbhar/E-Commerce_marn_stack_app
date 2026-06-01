import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import { FaShoppingCart } from "react-icons/fa";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";
const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const { darkMode } = useTheme();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
        { status: value }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
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
                <FaShoppingCart />
                All Orders
              </h1>
              <span className="dash-count">
                <b>{orders?.length || 0}</b> order
                {orders?.length !== 1 ? "s" : ""}
              </span>
            </div>

            {!orders?.length ? (
              <div className="dash-orders-empty">No orders yet.</div>
            ) : (
              <div className="dash-orders">
                {orders.map((o, i) => (
                  <div className="dash-order" key={o._id || i}>
                    {/* Summary header */}
                    <div className="dash-order-head">
                      <div className="dash-order-num">{i + 1}</div>

                      <div className="dash-order-cell">
                        <span className="k">Status</span>
                        <Select
                          bordered={false}
                          className="dash-status"
                          popupClassName="dash-select-dropdown"
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, idx) => (
                            <Option key={idx} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      <div className="dash-order-cell">
                        <span className="k">Buyer</span>
                        <span className="v">{o?.buyer?.name}</span>
                      </div>

                      <div className="dash-order-cell">
                        <span className="k">Date</span>
                        <span className="v">{moment(o?.createAt).fromNow()}</span>
                      </div>

                      <div className="dash-order-cell">
                        <span className="k">Payment</span>
                        <span
                          className={`dash-pay ${o?.payment?.success ? "ok" : "fail"}`}
                        >
                          {o?.payment?.success ? "Success" : "Failed"}
                        </span>
                      </div>

                      <div className="dash-order-cell">
                        <span className="k">Quantity</span>
                        <span className="v">{o?.products?.length}</span>
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="dash-order-items">
                      {o?.products?.map((p) => (
                        <div className="dash-line" key={p._id}>
                          <div className="dash-line-img">
                            <img
                              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                              alt={p.name}
                            />
                          </div>
                          <div className="dash-line-info">
                            <p className="dash-line-name">{p.name}</p>
                            <p className="dash-line-desc">
                              {p.description?.substring(0, 30)}
                            </p>
                            <p className="dash-line-price">
                              {Number(p.price || 0).toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
