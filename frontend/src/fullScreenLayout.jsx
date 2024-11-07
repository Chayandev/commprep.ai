// src/layouts/FullScreenLayout.jsx
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollArea";

const FullScreenLayout = () => {
  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default FullScreenLayout;
