// src/components/IconLink.js
import React from "react";
import { Link } from "react-router-dom";

const NavIconItem = ({ to, icon: Icon, text }) => {
  return (
    <Link
      to={to}
      className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-200/60 transition-all duration-200 hover:scale-110"
    >
      {Icon && <Icon className="h-5 w-5" />} {/* Render icon if provided */}
      {text && <span className="ml-2">{text}</span>} {/* Render text if provided with left margin */}
    </Link>
  );
};

export default NavIconItem;
