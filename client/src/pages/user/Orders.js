import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { TbTruck } from "react-icons/tb";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const { darkMode } = useTheme();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const inr = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <Layout title={"Your Orders"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <UserMenu />
          </aside>

          <main>
            <div className="dash-head-row">
              <h1 className="dash-heading" style={{ margin: 0 }}>
                <TbTruck />
                Your Orders
              </h1>
              <span className="dash-count">
                <b>{orders?.length || 0}</b> order
                {orders?.length !== 1 ? "s" : ""}
              </span>
            </div>

            {!orders?.length ? (
              <div className="dash-orders-empty">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="dash-orders">
                {orders.map((o, i) => (
                  <div className="dash-order" key={o._id || i}>
                    <div className="dash-order-head">
                      <div className="dash-order-num">{i + 1}</div>

                      <div className="dash-order-cell">
                        <span className="k">Status</span>
                        <span className="v">{o?.status}</span>
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
                            <p className="dash-line-price">{inr(p.price)}</p>
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

export default Orders;