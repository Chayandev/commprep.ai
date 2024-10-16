import { useState } from "react";
import "./App.css";
import Header from "./components/Header/header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/footer.jsx";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
