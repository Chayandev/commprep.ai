import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from "@mui/material";
import logo from "../../assets/commprepai.jpg";
import CustomTextField from "../../components/CustomTextField";
import { loginUser } from "../../../actions/auth.actions.js";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import FormDialog from "../../components/Dialog.jsx";
import {
  sendVerificationCode,
  verifyUserEmail,
} from "../../../actions/user.actions.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const isLoggingIn = useSelector((state) => state.auth.isProcessing);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(10);

    const loginData = {
      email: formValues.email,
      password: formValues.password,
    };

    // Dispatch the registerUser action on submit
    dispatch(loginUser(loginData))
      .unwrap()
      .then((result) => {
        setProgress(70);
        toast.success(result.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/practice");
      })
      .catch((error) => {
        // Show the error message as a toast error
        toast.error(error || "An error occurred during Login.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error during login:", error);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleEmailSend = async (email) => {
    setProgress(10);
    dispatch(sendVerificationCode({ email: email }))
      .unwrap()
      .then((result) => {
        setProgress(70);
        toast.success(result.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/emailVerification");
      })
      .catch((error) => {
        // Show the error message as a toast error
        toast.error(
          error || "An error occurred while sending verification code.",
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        console.error("Error during sending verification code:", error);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex flex-col justify-center items-center p-4">
      <LoadingBar
        color="#02cbc3"
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="mb-8">
        <img
          src={logo}
          alt="CommPrep.ai Logo"
          className="w-72 h-20 object-contain"
        />
      </div>
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardHeader
          title={
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{ fontWeight: 600 }}
            >
              Welcome Back
            </Typography>
          }
          subheader={
            <Typography align="center" color="textSecondary">
              Log in to your CommPrep.ai account
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <CustomTextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              required
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <CustomTextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              required
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-2 rounded-md shadow-md text-white inline-flex items-center justify-center ${
                isLoggingIn
                  ? "bg-teal-700 cursor-not-allowed"
                  : "bg-primary hover:bg-teal-700"
              }`}
            >
              {isLoggingIn && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-3 w-5 h-5 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
              {isLoggingIn ? "Processing..." : "Log in"}
            </button>
          </form>
        </CardContent>
        <CardActions className="flex flex-col space-y-4">
          <FormDialog
            dialogTitle="Verify your Email"
            dialogSubitle="To reset your password, please enter your email address here. We will send a verification code to your email to help you regain access to your account"
            onSend={handleEmailSend}
            trigger={
              <Typography
                variant="body2"
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Typography>
            }
          />

          <Typography variant="body2" color="textSecondary">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-teal-600 hover:underline">
              Sign up
            </Link>
          </Typography>
        </CardActions>
      </Card>
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-gray-600 hover:text-teal-600 inline-flex items-center"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          <Typography variant="body2" component="span">
            Back to Home
          </Typography>
        </Link>
      </div>
    </div>
  );
}
