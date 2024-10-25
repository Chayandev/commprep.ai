import Header from "./components/Header/header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollArea.jsx";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store.js";;

function App() {

  return (
    <>
      <Provider store={store}>
        <ToastContainer />
        <Header />
        <ScrollToTop />
        <Outlet/>
        <Footer />
      </Provider>
    </>
  );
}

export default App;
