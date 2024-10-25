// ScrollArea.jsx
import React from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Add smooth scrolling
    });
  }, [pathname]); // Triggers when the route (pathname) changes

  return null;
};

export default ScrollToTop;

