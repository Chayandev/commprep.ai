import React from "react";

const Score = ({ title, score, thresholds }) => {
  // Determine the background and text colors based on thresholds
  const getScoreClass = () => {
    if (parseFloat(score) < thresholds.low) {
      return "bg-red-100 text-red-800";
    } else if (parseFloat(score) < thresholds.high) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  return (
    <div>
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div
        className={`text-lg font-semibold rounded-full px-3 py-1 inline-block ${getScoreClass()}`}
      >
        {score}
      </div>
    </div>
  );
};

export default Score;
