import React from "react";
import { Typography, Card, CardContent, CardHeader } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Book,
  Headphones,
  MessageSquare,
  Mic,
  VolumeX,
  SpeechIcon,
} from "lucide-react";
import Progress from "../../components/Progress";
import "../../App.css";

export default function Practice() {
  const user = useSelector((state) => state.auth.user);
  const progressPercentage = 0;

  const categories = [
    {
      name: "Reading",
      icon: Mic,
      description: "Boost comprehension through active reading skills.",
      progress: 0,
      color: "from-pink-500 to-rose-500",
      path: "reading", // Add path for navigation
    },
    {
      name: "Listening",
      icon: Headphones,
      description: "Sharpen listening to grasp spoken language quickly.",
      progress: 0,
      color: "from-purple-500 to-indigo-500",
      path: "listening", // Add path for navigation
    },
    {
      name: "Grammar",
      icon: MessageSquare,
      description: "Master rules for clear, effective communication.",
      progress: 0,
      color: "from-green-500 to-emerald-500",
      path: "grammar", // Add path for navigation
    },
    {
      name: "Sentence Correction",
      icon: MessageSquare,
      description: "Perfect sentence structure with real-time feedback.",
      progress: 0,
      color: "from-yellow-500 to-amber-500",
      path: "sentence-correction", // Add path for navigation
    },
    {
      name: "Vocabulary",
      icon: Book,
      description: "Expand your lexicon for richer conversations.",
      progress: 0,
      color: "from-blue-500 to-cyan-500",
      path: "vocabulary", // Add path for navigation
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <main className="w-[90%] lg:w-[80%] mx-auto py-6">
        <div className="relative px-4 py-6 sm:px-0">
          <div className=" relative rounded-lg border border-gray-300/50 p-6 bg-white shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">
              Welcome back,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                {user?.username}
              </span>
              !
            </h1>

            <p className="mt-2 text-lg text-gray-600 text-center sm:text-left">
              Ready to elevate your communication game?
            </p>
            <div className="flex justify-center sm:justify-start">
              <button className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105">
                Start Your Journey
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Progress
              </h2>
              <Progress
                value={progressPercentage}
                className="mt-4 h-4 rounded-full bg-gray-200"
                indicatorClassName="bg-gradient-to-r from-teal-500 to-blue-600"
              />
              <p className="mt-2 text-lg text-gray-600">
                {progressPercentage}% of goals achieved
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  sx={{
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.05)",
                    },
                  }}
                  className="overflow-hidden  transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  <CardHeader
                    className={`bg-gradient-to-r ${category.color} text-white`}
                    title={
                      <Typography
                        variant="h5"
                        style={{ fontWeight: 600 }}
                        className="flex items-center gap-2 text-white"
                      >
                        <category.icon className="h-6 w-6" />
                        {category.name}
                      </Typography>
                    }
                  />
                  <CardContent className="pt-4">
                    <Typography className="text-gray-600 mb-4">
                      {category.description}
                    </Typography>
                    <Progress
                      value={category.progress}
                      className="h-2 my-4 rounded-full bg-gray-200"
                      indicatorClassName={`bg-gradient-to-r ${category.color}`}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {category.progress}% complete
                    </p>
                    <Link
                      to={`/practice/${category.path}`}
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        className={`mt-4 w-full bg-gradient-to-r ${category.color} text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105`}
                      >
                        Practice {category.name}
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
