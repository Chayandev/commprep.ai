import React from "react";

const Score = ({ title, score, thresholds, pill, description }) => {
  // Determine the background and text colors based on thresholds
  const getScoreClass = () => {
    const num = parseFloat(score);
    if (isNaN(num) || num < thresholds.low) {
      return "bg-red-100 text-red-800";
    } else if (num < thresholds.high) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 rounded-lg bg-gray-50/70 border border-gray-100">
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-700">{title}</span>
          {pill && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {pill}
            </span>
          )}
        </div>
        <div className="my-1">
          <span
            className={`text-base font-bold rounded-full px-2.5 py-0.5 inline-block ${getScoreClass()}`}
          >
            {score}
          </span>
        </div>
      </div>
      {description && (
        <span className="text-[11px] text-gray-500 mt-1.5 leading-tight">
          {description}
        </span>
      )}
    </div>
  );
};

export default Score;
