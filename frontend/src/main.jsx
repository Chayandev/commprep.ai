import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./components/Home/home.jsx";
import Login from "./components/Login/login.jsx";
import Signup from "./components/Signup/signup.jsx";
import AvatarContextProvider from "./context/AvatarContextProvider.jsx";
import EmailVerification from "./components/Verification/emailVerification.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="emailverification" element={< EmailVerification/>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AvatarContextProvider>
      <RouterProvider router={router} />
    </AvatarContextProvider>
  </StrictMode>
);
