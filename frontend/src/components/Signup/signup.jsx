import React, { useState, useEffect, useContext } from "react";
import logo from "../../assets/commprepai.jpg";
import { Link, NavLink } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Box,
} from "@mui/material";
import { ArrowForward as ArrowRight } from "@mui/icons-material";
import { Radio, RadioGroup } from "@headlessui/react";
import CustomTextField from "../CustomTextField";
import UserContext from "../../context/UserContext.js";
import GridLoader from "react-spinners/GridLoader.js";

const overrideCSS = {
  display: "block",
  margin: "auto",
  padding: "20px 0", // Add padding here
};

export default function Signup() {
  const { avatars, fetchAvatars, isLoading } = useContext(UserContext);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch avatars from the backend
  useEffect(() => {
    if (avatars.length === 0) {
      fetchAvatars();
    } else {
      setSelectedAvatar(avatars[0].public_id);
    }
  }, [fetchAvatars, avatars]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formValues.name) {
      errors.name = "Full Name is required";
    }
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formValues.password) {
      errors.password = "Password is required";
    }
    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit form logic
    console.log("Form submitted with avatar:", selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex flex-col justify-center items-center p-4">
      <div className="mb-8">
        <img
          src={logo}
          alt="CommPrep.ai Logo"
          width={300}
          height={80}
          className="h-20 w-auto bg-transparent"
        />
      </div>
      <Card className="w-full max-w-3xl p-4">
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
              className="w-full bg-primary hover:bg-teal-700 py-2 rounded-md shadow-md text-white"
            >
              Sign Up
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
