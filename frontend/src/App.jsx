import Header from "./components/Header/header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollArea.jsx";

import authWrapper from "./authWrapper.js";
function App() {
  
  return (
    <>
 
        <ToastContainer />
        <Header />
        <ScrollToTop />
        <Outlet />
        <Footer />
 
    </>
  );
}

export default App;
