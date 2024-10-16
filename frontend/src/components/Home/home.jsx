import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Book,
  Headphones,
  MessageSquare,
  Star,
} from "lucide-react";
import Card from "../Card"; // Make sure the path is correct

export default function Home() {
  const features = [
    {
      name: "Reading",
      icon: Book,
      description:
        "Supercharge your reading skills! Dive into texts with ease and speed, so you can grasp key ideas in no time.",
    },
    {
      name: "Listening Practice",
      icon: Headphones,
      description:
        "Tune into a world of sounds! Experience different accents and styles to sharpen your listening skills like a pro.",
    },
    {
      name: "Grammar",
      icon: MessageSquare,
      description:
        "Get grammar savvy! Nail down the rules and use them like a native speaker, so you can write and speak with confidence.",
    },
    {
      name: "Vocabulary Building",
      icon: Star,
      description:
        "Level up your word game! Expand your vocabulary to express yourself better and connect with others in meaningful ways.",
    },
  ];

  return (
    <div className="min-h-[84vh] bg-gradient-to-br from-teal-50 to-blue-100">
      <main className="w-[80%] mx-auto">
        <div className="py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Master Your</span>
                <span className="block text-teal-600">
                  Communication Skills
                </span>
                <span className="block text-blue-600">with AI</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Enhance your speaking, listening, and overall communication
                abilities with our AI-powered platform. Practice and improve for
                personal and professional success.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button className="text-lg bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105">
                  <Link to="/" className="inline-flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="CommPrep.ai in action"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <svg
                      className="h-20 w-20 text-teal-500"
                      fill="currentColor"
                      viewBox="0 0 84 84"
                    >
                      <circle
                        opacity="0.9"
                        cx="42"
                        cy="42"
                        r="42"
                        fill="white"
                      />
                      <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-white">
        <div className="mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              AI-Powered Communication Training
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our platform offers a wide range of features to help you improve
              your communication skills using cutting-edge AI technology.
            </p>
          </div>
          <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {features.map((feature) => (
              <Card
                key={feature.name}
                className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <feature.icon className="h-6 w-6 text-teal-600 mr-3" />
                  {feature.name}
                </div>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </Card>
            ))}
          </dl>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
            <span className="block text-teal-900">
            Join us and elevate your experience with us.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button className="bg-white text-lg font-semibold text-teal-600 hover:bg-teal-50 py-3 px-8 rounded-md">
                <Link to="/signup">Get started</Link>
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button className="bg-teal-600 text-lg font-semibold text-white hover:bg-teal-700 py-3 px-8 rounded-md border border-white">
                <Link to="/">Learn more</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
