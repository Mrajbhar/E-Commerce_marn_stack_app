import React from "react";
import Layout from "./../components/Layout/Layout";
import {MdEmail} from "react-icons/md"
import {BsPhoneFill} from "react-icons/bs"
import {PiHeadphonesFill} from "react-icons/pi";
const Contact = () => {
  return (
    <Layout title={"Contact us - E-Commerce App"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <MdEmail  /> : www.help@ecommerceapp.com
          </p>
          <p className="mt-3">
            <BsPhoneFill /> : 012-3456789
          </p>
          <p className="mt-3">
            <PiHeadphonesFill /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
