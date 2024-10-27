import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import AvatarContextProvider from "./context/AvatarContextProvider.jsx";
import App from "./App.jsx";
import Login from "./pages/Login/login.page.jsx";
import Signup from "./pages/Signup/signup.page.jsx";
import EmailVerification from "./pages/Verification/emailVerification.page.jsx";
import Practice from "./pages/Practice/practice.page.jsx";
import Home from "./pages/Home/home.page.jsx";
import Feedback from "./pages/Feedback/feedback.page.jsx";
import Contact from "./pages/Contact/contact.page.jsx";
import TakeTest from "./pages/TakeTest/takeTest.page.jsx";
import LoadingPage from "./components/LoadingPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<LoadingPage />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="emailverification" element={<EmailVerification />} />
      <Route path="practice" element={<Practice />} />
      <Route path="takeTest" element={<TakeTest />} />
      <Route path="contact" element={<Contact />} />
      <Route path="feedback" element={<Feedback />} />
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
