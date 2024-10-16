import React from "react";
import logo from "../../assets/commprepai.jpg";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="shadow sticky z-50 top-0">
  <nav className="bg-white/80 backdrop-blur-md shadow-md">
        <div className="flex flex-wrap justify-between items-center h-16 mx-auto w-[80%]">
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="Commprep.ai logo"
              width={180}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-baseline space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 
              rounded-md text-sm font-medium transition-colors duration-200
              border"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-white bg-black hover:bg-gray-700 px-3 py-2 
              rounded-md text-sm font-medium transition-colors duration-200
              focus:outline-none
              "
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
