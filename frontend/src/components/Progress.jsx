import React from "react";
import PropTypes from "prop-types";

function Progress({ value, className = "", indicatorClassName = "" }) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="overflow-hidden h-full rounded-full bg-gray-300/50">
        <div
          className={`h-full rounded-full ${indicatorClassName}`}
          style={{
            width: `${value}%`,
            transition: "width 3s ease-in-out", // Add smooth animation
          }}
        ></div>
      </div>
    </div>
  );
}

Progress.propTypes = {
  value: PropTypes.number.isRequired, // Progress percentage (0-100)
  className: PropTypes.string, // Additional styling for the container
  indicatorClassName: PropTypes.string, // Styling for the progress indicator
};

export default Progress;
