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
// FullScreenLayout without Header/Footer
import Login from "./pages/Login/login.page.jsx";
import Signup from "./pages/Signup/signup.page.jsx";
import EmailVerification from "./pages/Verification/emailVerification.page.jsx";
import Practice from "./pages/Practice/practice.page.jsx";
import Home from "./pages/Home/home.page.jsx";
import Feedback from "./pages/Feedback/feedback.page.jsx";
import Contact from "./pages/Contact/contact.page.jsx";
import TakeTest from "./pages/TakeTest/takeTest.page.jsx";
import LoadingPage from "./components/LoadingPage.jsx";
import ResetPassword from "./pages/RestPassword/resetPassword.page.jsx";
import ReadingAssessments from "./pages/Practice/reading.page.jsx";
import ReadingAssessmentPractice from "./pages/Assessments/reading.assessment.page.jsx";
import FullScreenLayout from "./fullScreenLayout.jsx";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import ListeningAssessments from "./pages/Practice/listening.page.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Full-Screen Layout Routes (without Header/Footer) */}

      <Route element={<FullScreenLayout />}>
        <Route
          path="practice/reading/assessment/:assessmentId"
          element={<ReadingAssessmentPractice />}
        />
      </Route>

      {/* Main Layout Routes (with Header/Footer) */}
      <Route path="/" element={<App />}>
        <Route path="" element={<LoadingPage />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route path="signup" element={<Signup />} />
        <Route path="emailverification" element={<EmailVerification />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/reading" element={<ReadingAssessments />} />
        <Route path="practice/listening" element={<ListeningAssessments />} />
        <Route path="takeTest" element={<TakeTest />} />
        <Route path="contact" element={<Contact />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AvatarContextProvider>
        <RouterProvider router={router} />
      </AvatarContextProvider>
    </Provider>
  </StrictMode>
);
