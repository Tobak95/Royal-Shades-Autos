import React from "react";
import Nav from "../component/layout/Nav";
import Footer from "../component/layout/Footer";

const AboutUs = () => {
  return (
    <div>
      <Nav />
      <div className=" backGround justify-center text-center">
        <div className="layout py-10 ">
          <h3 className="text-red-500 lg:text-[25px]">Our vision:</h3>
          <h1 className="px-3 lg:text-[50px] mt-5 text-black">
            Is to provide the best customer experience becoming a preferred
            partner.
          </h1>
          <h3 className="text-red-500 lg:text-[25px] mt-10">Our mission:</h3>
          <h1 className="px-3 lg:text-[50px] mt-5 text-black">
            Is to give new life to vehicles by providing responsible automotive
            solutions.
          </h1>
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default AboutUs;
