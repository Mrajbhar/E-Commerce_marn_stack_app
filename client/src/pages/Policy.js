import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <img
              src="/images/contactus.jpeg"
              alt="Privacy Policy"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0">
            <h2 className="mb-4">Privacy Policy</h2>
            <p className="text-justify">
              At Ecommerce App, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website or services.
            </p>
            <h4 className="mb-3">Information We Collect</h4>
            <p className="text-justify">
              We may collect various types of information from you, including but not limited to:
            </p>
            <ul className="text-justify">
              <li>Your name, email address, and other contact details.</li>
              <li>Payment information, such as credit card details.</li>
              <li>Information about your orders, preferences, and interactions with our website.</li>
              <li>Device and browsing information, including IP address, browser type, and cookies.</li>
            </ul>
            <h4 className="mb-3">How We Use Your Information</h4>
            <p className="text-justify">
              We use the information we collect for various purposes, including but not limited to:
            </p>
            <ul className="text-justify">
              <li>Processing your orders and transactions.</li>
              <li>Providing customer support and responding to inquiries.</li>
              <li>Personalizing your shopping experience and improving our website.</li>
              <li>Sending promotional offers, newsletters, and updates (with your consent).</li>
              <li>Complying with legal requirements and protecting our rights and interests.</li>
            </ul>
            <p className="text-justify">
              For more details about how we collect, use, and disclose your information, please read our full <a href="/privacy-policy" className="text-decoration-none">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Policy;
