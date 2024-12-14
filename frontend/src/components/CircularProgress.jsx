import React from "react";

const CircularProgress = ({
  value,
  max,
  phase,
  size = 200,
  strokeWidth = 15,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={`text-teal-50 ${phase==="finished"?"text-red-50":""}`}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-secondary transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{value}</span>
        <span
          className={`md:text-lg font-semibold ${
            phase === "finished" ? "text-red-600" : ""
          }`}
        >
          {phase === "thinking"
            ? "Think"
            : phase === "speaking"
            ? "Speak"
            : "Time's Up"}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
