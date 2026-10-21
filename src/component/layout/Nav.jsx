import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "../../../hooks/UseAppContext";
import avatar from "../../assets/avatar.png";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";

const Nav = () => {
  const [showMenuHamburger, setShowMenuHamburger] = useState(false);

  const [showLogOut, setShowLogOut] = useState(false);
  // This component renders a navigation bar with a title

  

  const redirect = useNavigate();

  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    redirect("/login");
  };

  const userLinks = [
    { title: "Home", path: "/" },
    { title: "Contact", path: "#" },
    { title: "About Us", path: "/about-us" },
  ];

  const notUserLinks = [
    // You can add navigation links here if needed
    { title: "Listing", path: "/register" },
    { title: "New Deals", path: "/register" },
  ];
  return (
    <nav className="bg-blue-950 text-white p-4 h-[100.75px] sticky top-0 z-50 ">
      <div className="layout flex items-center py-4 justify-between">
        <div>
          <h1 className="text-[20px] lg:text-[30px]">Prime Auto's</h1>
        </div>

        {user ? (
          <div className="hidden lg:flex items-center gap-4 text-white">
            {userLinks.map((link, index) => {
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-blue-300 transition-colors"
                >
                  {link.title}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-4 text-white">
            {userLinks.map((link, index) => {
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-blue-300 transition-colors"
                >
                  {link.title}
                </Link>
              );
            })}

            {!user &&
              notUserLinks.map((link, index) => {
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className="hover:text-blue-300 transition-colors"
                  >
                    {link.title}
                  </Link>
                );
              })}
          </div>
        )}

        <div className="ml-45 lg:hidden">
          {showMenuHamburger ? (
            <MdOutlineClose
              className="text-[30px] cursor-pointer  "
              onClick={() => setShowMenuHamburger(!showMenuHamburger)}
            />
          ) : (
            <IoMdMenu
              className="text-[30px] cursor-pointer "
              onClick={() => setShowMenuHamburger(!showMenuHamburger)}
            />
          )}

          {showMenuHamburger && (
            <div className="flex flex-col px-5 py-4 mr-1 absolute top-[55px] right-0 bg-black text-white rounded-lg cursor-pointer lg:hidden">
              {userLinks.map((link, index) => {
                return (
                  <a
                    key={index}
                    href={link.path}
                    className="hover:text-red-500 hover:font-bold hover:text-[20px]"
                  >
                    {link.title}
                  </a>
                );
              })}

              {!user &&
                notUserLinks.map((link, index) => {
                  return (
                    <Link
                      key={index}
                      to={link.path}
                      className="hover:text-blue-300 transition-colors"
                    >
                      {link.title}
                    </Link>
                  );
                })}
            </div>
          )}
        </div>

        {user ? (
          <div className="hidden lg:flex items-center  relative">
            <div className="flex items-center gap-2">
              <button className="border border-1px text-white font-bold px-8 py-2 text-xl rounded-lg cursor-pointer">
                <img src={avatar} alt="..." className="w-[20px] h-[20px]" />
              </button>

              <button
                onClick={() => setShowLogOut(!showLogOut)}
                className="cursor-pointer "
              >
                {showLogOut ? (
                  <IoIosArrowUp size={20} className="text-red-500" />
                ) : (
                  <IoIosArrowDown size={20} className="text-red-500" />
                )}
              </button>
            </div>

            {showLogOut && (
              <button
                onClick={handleLogout}
                className="bg-white text-black font-bold px-5 py-2 text-sm rounded-lg cursor-pointer absolute top-12   z-10"
              >
                LogOut
              </button>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-4">
            <Link to={"/login"}>
              <button className="bg-black px-8 py-2 text-xl font-bold rounded-lg cursor-pointer">
                Login
              </button>
            </Link>
            <Link to={"/register"}>
              <button className="bg-blue-800 px-8 py-2 text-xl font-bold rounded-lg cursor-pointer">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
