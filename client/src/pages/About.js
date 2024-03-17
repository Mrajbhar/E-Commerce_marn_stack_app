import React from "react";
import Layout from "./../components/Layout/Layout";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout title={"About Us - Ecommerce App"}>
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <img
              src="/images/about.jpeg"
              alt="About Us"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0">
            <h2 className="mb-4">Who We Are</h2>
            <p className="text-justify">
              At Ecommerce App, we are passionate about providing exceptional shopping experiences to our customers. Our mission is to offer a wide range of high-quality products and personalized services, making online shopping convenient, enjoyable, and reliable.
            </p>
            <p className="text-justify">
              Our team consists of dedicated professionals who are committed to delivering excellence in every aspect of our business. From product selection and customer support to secure payment processing and fast shipping, we strive to exceed our customers' expectations.
            </p>
            <p className="text-justify">
              Explore our website to discover an extensive collection of products from various categories, including electronics, fashion, home essentials, and more. Whether you're looking for the latest trends or everyday essentials, we've got you covered.
            </p>
            <p className="text-justify">
              We value your feedback and are always here to assist you. Feel free to contact us with any questions, suggestions, or concerns. Thank you for choosing Ecommerce App for your online shopping needs.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
