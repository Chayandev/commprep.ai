import React from "react";

const TextArea = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-4 border border-gray-300 rounded-md text-lg transition-colors focus:border-teal-600 focus:ring focus:ring-teal-200 ${className}`}
      style={{ borderColor: "gray" }} // Default border color
    />
  );
};

export default TextArea;
