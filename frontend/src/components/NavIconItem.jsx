// src/components/IconLink.js
import React from "react";
import { Link } from "react-router-dom";

const NavIconItem = ({ to, icon: Icon, text }) => {
  return (
    <Link
      to={to}
      className="items-center p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-200/60 transition-all duration-200 hover:scale-110"
    >
      {Icon ? <Icon className="h-5 w-5" /> : null}{" "}
      {/* Render icon if provided */}
      {text ? <span>{text}</span> : null} {/* Render text if provided */}
    </Link>
  );
};

export default NavIconItem;
