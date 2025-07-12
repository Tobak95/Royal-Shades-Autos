import React from "react";

const Nav = () => {
  // This component renders a navigation bar with a title

  const links = [
    // You can add navigation links here if needed
    { title: "Home", path: "/" },
    { title: "Listing", path: "#" },
    { title: "Blogs", path: "#" },
    { title: "pages", path: "#" },
    { title: "About", path: "#" },
    { title: "Contact", path: "#" },
    { title: "Sign-in", path: "/register" },
  ];
  return (
    <nav className="bg-blue-950 text-white p-4 h-[100.75px] sticky top-0 z-50 ">
      <div className="layout flex items-center justify-between">
        <div>
          <h1 className="text-[30px]">Prime Auto's</h1>
        </div>
        <div className="flex items-center  gap-4 text-white">
          {links.map((link, index) => {
            return ( 
              <a
                key={index}
                href={link.path}
                className="hover:text-blue-300 transition-colors"
              >
                {link.title}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
