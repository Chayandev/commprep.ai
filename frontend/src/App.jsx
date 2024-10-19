import { useState } from "react";
import "./App.css";
import Header from "./components/Header/header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <ToastContainer />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
