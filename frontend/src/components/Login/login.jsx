import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from "@mui/material";
import logo from "../../assets/commprepai.jpg";
import CustomTextField from "../CustomTextField";

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex flex-col justify-center items-center p-4">
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
              variant="outlined"
              type="email"
              fullWidth
              required
            />
            <CustomTextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              required
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-teal-700 py-2 rounded-md shadow-md text-white"
            >
              Log In
            </button>
          </form>
        </CardContent>
        <CardActions className="flex flex-col space-y-4">
          <Link to="/forgot-password" className="text-teal-600 hover:underline">
            <Typography variant="body2" color="text-primary" component="span">
              Forgot your password?
            </Typography>
          </Link>
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
