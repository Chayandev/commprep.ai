import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/commprepai.jpg";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Card, CardContent, CardHeader } from "@mui/material";
import { verifyUserEmail } from "../../../actions/user.actions";
import { useDispatch, useSelector } from "react-redux";

const EMAIL_CODE_LENGTH = 6; // Constant for the length of the email verification code

export default function EmailVerification() {
  // State variables
  const [code, setCode] = useState(Array(EMAIL_CODE_LENGTH).fill("")); // Array to hold each digit of the verification code
  const inputRefs = useRef([]); // Refs to manage focus on input fields
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [progress, setProgress] = useState(0); // State for loading progress
  const dispatch = useDispatch();
  const isVerifying = useSelector((state) => state.verify.isProcessing);
  const verificationError = useSelector(
    (state) => state.verify.verificationError
  );

  // Handle input change
  const handleChange = (index, value) => {
    const newCode = [...code]; // Create a copy of the current code
    newCode[index] = value; // Update the specific index with the new value
    setCode(newCode); // Update state with the new code

    // Move focus to the next input if the current one is filled
    if (value && index < EMAIL_CODE_LENGTH - 1)
      inputRefs.current[index + 1].focus();
  };

  // Handle key down events for navigation
  const handleKeyDown = (index, e) => {
    // If Backspace is pressed and the current input is empty, move focus back
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setProgress(10); // Start loading progress

    // Dispatch the verification email action on submit
    dispatch(verifyUserEmail({ verificationCode: code.join("") }))
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
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during email-verification:", error);
        console.log(verificationError);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  // Automatically submit the form when the code is fully filled
  useEffect(() => {
    if (code.every((value) => value !== "")) handleSubmit(new Event("submit"));
  }, [code]); // Dependency array to monitor changes in the code

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-teal-100 flex flex-col justify-center items-center p-4">
      <LoadingBar
        color="#02cbc3"
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <img
        src={logo}
        alt="CommPrep.ai Logo"
        className="w-72 h-20 object-contain mb-8"
      />
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardHeader
          title={
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              fontWeight={600}
            >
              Verify Your Email
            </Typography>
          }
          subheader={
            <Typography align="center" color="textSecondary">
              We've sent a verification code to your email. Please enter it
              below.
            </Typography>
          }
        />
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-evenly">
              {code.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)} // Assign ref for each input
                  type="text"
                  maxLength="1" // Limit input to 1 character
                  value={value} // Bind the input value to the state
                  onChange={(e) => handleChange(index, e.target.value)} // Handle input change
                  onKeyDown={(e) => handleKeyDown(index, e)} // Handle key down events
                  className={` w-12 h-12 px-4 text-center font-semibold bg-gray-50 text-black text-base border-2 
                    ${
                      code.some((v) => !v)
                        ? "border-gray-300"
                        : "border-secondary"
                    } rounded-lg focus:border-secondary focus:outline-none`}
                />
              ))}
            </div>
            {verificationError && (
              <p className="text-red-500 font-semibold text-center mt-2">
                {verificationError}
              </p>
            )}{" "}
            {/* Display error message */}
            <button
              type="submit"
              disabled={isVerifying || code.some((value) => !value)} // Disable button if verifying or code is incomplete
              className={`w-full py-2 rounded-md shadow-md text-white inline-flex items-center justify-center 
                ${
                  isVerifying || code.some((value) => !value)
                    ? "bg-teal-700 cursor-not-allowed"
                    : "bg-primary hover:bg-teal-700"
                }`}
            >
              {isVerifying ? ( // Show loading spinner when verifying
                <>
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
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
