import React from "react";
import Nav from "../component/layout/Nav";
import { Link, useNavigate } from "react-router-dom";


const HomePage = () => {
  const redirect = useNavigate();
  return (
    <div>
      <Nav />
      <div className=" h-screen background bg-no-repeat bg-cover bg-center flex items-center gap-4">
        <div className="flex flex-col items-start ml-[120px]">
          <div>
            <h1 className="font bold font-satoshi text-[80px] ">Prime Autos</h1>
          </div>
          <div>
            <Link to="/register">
              <button className="bg-white text-black font-bold text-[20px] rounded-lg px-4 py-2 hover:bg-gray-600 cursor-pointer">
                click here to sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
// This is the HomePage component that serves as the landing page for the
