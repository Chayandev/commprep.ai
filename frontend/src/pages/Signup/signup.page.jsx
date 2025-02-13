import React, { useState, useEffect, useContext } from "react";
import logo from "../../assets/commprepai.jpg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";

import {
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { ArrowForward as ArrowRight } from "@mui/icons-material";
import { Radio, RadioGroup } from "@headlessui/react";
import CustomTextField from "../../components/CustomTextField.jsx";
import UserContext from "../../context/UserContext.js";
import GridLoader from "react-spinners/GridLoader.js";
import { registerUser } from "../../../actions/auth.actions.js";
import { useDispatch, useSelector } from "react-redux";

const overrideCSS = {
  display: "block",
  margin: "auto",
  padding: "20px 0", // Add padding here
};

export default function Signup() {
  const navigate = useNavigate(); // Initialize useNavigate
  const { avatars, fetchAvatars, isLoading } = useContext(UserContext);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [hasFetchedAvaters, setHasFetchedAvatars] = useState(false);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();

  const isRegistering = useSelector((state) => state.auth.isProcessing);

  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch avatars from the backend
  useEffect(() => {
    if (!hasFetchedAvaters && avatars.length === 0) {
      fetchAvatars();
      setHasFetchedAvatars(true); // Set it to true after trying to fetch once
    }
    if (avatars.length !== 0 && !selectedAvatar) {
      setSelectedAvatar(avatars[0].public_id);
    }
  }, [avatars, fetchAvatars, hasFetchedAvaters]);

  // useEffect(() => {
  //   console.log(selectedAvatar);
  // }, [setSelectedAvatar,selectedAvatar]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase() : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    setProgress(10);

    if (!formValues.name) {
      errors.name = "Full Name is required";
    }
    if (!formValues.username) {
      errors.username = "Username is required";
    } else if (formValues.username !== formValues.username.toLowerCase()) {
      errors.username = "Username must be in lowercase";
    }
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password =
        "Password should be strong , should have atleast 6 characters";
    }
    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setProgress(100);
      return;
    }

    // Prepare the data to send to the backend
    const userData = {
      fullname: formValues.name,
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      role: formValues.role, // Role input from dropdown
      avatar: selectedAvatar, // Selected avatar
    };

    // Dispatch the registerUser action on submit
    dispatch(registerUser(userData))
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
        toast.error(error || "An error occurred during registration.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error during registration:", error);
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
          width={300}
          height={80}
          className="h-20 w-auto bg-transparent"
        />
      </div>
      <Card className="w-full max-w-3xl p-4 overflow-hidden">
        <CardHeader
          title={
            <Typography
              variant="h4"
              align="center"
              color="text.primary"
              style={{ fontWeight: 600 }}
            >
              Create an Account
            </Typography>
          }
          subheader={
            <Typography align="center" color="text.secondary">
              Join CommPrep.ai and start improving your communication skills
            </Typography>
          }
        />
        <CardContent sx={{ py: 4 }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
              gap={2}
            >
              <CustomTextField
                id="fullname"
                label="Full Name"
                variant="outlined"
                required
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <CustomTextField
                id="username"
                label="Username"
                variant="outlined"
                required
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
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
              {/* dropdown for roles */}
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#02cbc3", // Custom focus color
                    },
                  },
                }}
              >
                <Select
                  name="role"
                  displayEmpty
                  labelId="role-label"
                  id="role"
                  value={formValues.role}
                  onChange={handleInputChange}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem disabled value="">
                    <em className="text-gray-500">Role describe you best</em>
                  </MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="profesional">Profesional</MenuItem>
                  <MenuItem value="corporate-person">Corporate-person</MenuItem>
                </Select>
              </FormControl>
              <CustomTextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                required
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <CustomTextField
                id="confirmpassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                required
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />
            </Box>
            <div>
              <label className="block text-lg font-semibold">
                Select Avatar
              </label>
              <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md">
                {isLoading ? (
                  <GridLoader
                    color="#02cbc3"
                    loading={isLoading}
                    cssOverride={overrideCSS}
                  />
                ) : avatars.length > 0 ? (
                  <RadioGroup
                    value={selectedAvatar}
                    onChange={setSelectedAvatar}
                  >
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                      {avatars.map((avatar) => (
                        <Radio
                          key={avatar.public_id}
                          value={avatar.public_id}
                          className={`relative flex flex-col items-center justify-center border rounded-full transition shadow-md duration-200 ease-in-out ${
                            selectedAvatar === avatar.public_id
                              ? "border-2 border-secondary/90 bg-secondary/5"
                              : "border-gray-300 bg-white hover:border-gray-700"
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-fill rounded-full"
                          />
                        </Radio>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <p className="text-center p-4 text-md">
                    No avatars available.
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full py-2 rounded-md shadow-md text-white inline-flex items-center justify-center ${
                isRegistering
                  ? "bg-teal-700 cursor-not-allowed"
                  : "bg-primary hover:bg-teal-700"
              }`}
            >
              {isRegistering && (
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
              {isRegistering ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </CardContent>
        <CardActions>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            className="w-full"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </Typography>
        </CardActions>
      </Card>
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-primary inline-flex items-center"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
