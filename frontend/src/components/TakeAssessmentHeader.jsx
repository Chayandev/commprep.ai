import React from "react";

const TakeAssessmentHeader = ({ title, assessment }) => {
  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <div
        className={` mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
          difficultyColor[assessment?.difficulty] || "bg-gray-200 text-gray-800"
        }`}
      >
        Difficulty: {assessment?.difficulty}
      </div>
    </div>
  );
};

export default TakeAssessmentHeader;
