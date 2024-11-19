import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const TimeDisplay = forwardRef(({ timeLeft, isScrolled }, ref) => {
  const formatTime = (seconds) => {
    // Round the seconds to remove any fractional values
    const roundedSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    // Format the time as "minutes:seconds"
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Determine classes based on conditions
  const baseClasses =
    "mb-6 text-4xl font-bold px-6 py-3 rounded-full shadow-inner transition-all duration-300 ease-in-out";
  const scrolledClasses = isScrolled
    ? "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-10"
    : "";
  const timeClasses =
    timeLeft > 5 && timeLeft <= 10
      ? "text-yellow-600 bg-yellow-50 blink"
      : timeLeft <= 5
      ? "text-red-600 bg-red-50 blink"
      : "text-teal-600 bg-teal-50";

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${scrolledClasses} ${timeClasses}`}
    >
      {timeLeft > 0 ? `${formatTime(timeLeft)}` : "Time's up!"}
    </div>
  );
});

// Define PropTypes
TimeDisplay.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  isScrolled: PropTypes.bool.isRequired,
};

export default TimeDisplay;
