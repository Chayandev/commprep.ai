import React, { useState, useRef } from "react";
import logo from "../../assets/commprepai.jpg";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Card, CardContent, CardHeader } from "@mui/material";

const EMAIL_CODE_LENGTH = 8;
export default function EmailVerification() {
  const [code, setCode] = useState(Array(EMAIL_CODE_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();

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
          <button
            type="submit"
            className="w-full bg-primary hover:bg-teal-700 py-2 rounded-md shadow-md text-white"
          >
            Verify
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
