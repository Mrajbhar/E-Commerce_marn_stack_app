import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import "../styles/Categories.css";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="container">
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-3 col-sm-6 mt-4" key={c._id}>
              <Link to={`/category/${c.slug}`} className="category-link">
                <div className="category-menu">
                  <div className="category-icon">{c.icon}</div>
                  <div className="category-name">{c.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
