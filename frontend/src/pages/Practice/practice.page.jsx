import React, { Suspense } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";
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
import LazyLoadingCard from "../../components/LazyLoadingCard";
const CategoryCard = React.lazy(() => import("../../components/CategoryCard"));
//import CategoryCard from "../../components/CategoryCard";

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
              <div className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105">
                Start Your Journey
              </div>
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
                <Suspense key={uuidv4()} fallback={<LazyLoadingCard />}>
                  <CategoryCard key={category.name} category={category} />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
