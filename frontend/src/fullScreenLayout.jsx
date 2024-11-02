// src/layouts/FullScreenLayout.jsx
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const FullScreenLayout = () => {
  return (
    <>
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default FullScreenLayout;
