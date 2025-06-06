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
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import ListeningAssessments from "./pages/Practice/listening.page.jsx";
import ListeningAssessmentPractice from "./pages/Assessments/listening.assessment.page.jsx";
import GrammarAssessments from "./pages/Practice/grammar.page.jsx";
import GrammarAssessmentPractice from "./pages/Assessments/grammar.assessment.page.jsx";
import VocabularyAssessments from "./pages/Practice/vocabulary.page.jsx";
import VocabularyAssessmentPractice from "./pages/Assessments/vocabulary.assessment.page.jsx";
import SpeakingAssessments from "./pages/Practice/speaking.page.jsx";
import SpeakingAssessmentPractice from "./pages/Assessments/speaking.assessment.page.jsx";
import Profile from "./pages/Profile/profile.page.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Full-Screen Layout Routes (without Header/Footer) */}
      {/* <Route element={<FullScreenLayout />}>
        <Route
          path="practice/reading/assessment/:assessmentId"
          element={<ReadingAssessmentPractice />}
        />
        <Route
          path="practice/listening/assessment/:assessmentId"
          element={<ListeningAssessmentPractice />}
        />
      </Route> */}

      {/* Main Layout Routes (with Header/Footer) */}
      <Route path="/" element={<App />}>
        {/* <Route path="" element={<LoadingPage />} /> */}
        <Route path="" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route path="signup" element={<Signup />} />
        <Route path="emailverification" element={<EmailVerification />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/reading" element={<ReadingAssessments />} />
        <Route path="practice/listening" element={<ListeningAssessments />} />
        <Route path="practice/grammar" element={<GrammarAssessments />} />
        <Route path="practice/vocabulary" element={<VocabularyAssessments />} />
        <Route path="practice/speaking" element={<SpeakingAssessments />} />
        <Route path="takeTest" element={<TakeTest />} />
        <Route path="contact" element={<Contact />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="profile" element={<Profile />} />

        <Route
          path="practice/reading/assessment/:assessmentId"
          element={<ReadingAssessmentPractice />}
        />
        <Route
          path="practice/listening/assessment/:assessmentId"
          element={<ListeningAssessmentPractice />}
        />
        <Route
          path="practice/grammar/assessment/:assessmentId"
          element={<GrammarAssessmentPractice />}
        />
        <Route
          path="practice/vocabulary/assessment/:assessmentId"
          element={<VocabularyAssessmentPractice />}
        />

        <Route
          path="practice/speaking/assessment/:assessmentId"
          element={<SpeakingAssessmentPractice />}
        />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AvatarContextProvider>
      <RouterProvider router={router} />
    </AvatarContextProvider>
  </Provider>
);
