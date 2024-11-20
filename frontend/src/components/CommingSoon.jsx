import React from "react";
// Import custom CSS for gradient text animation

const ComingSoon = ({page}) => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-[#0d3b66] via-[#03ccc2] to-[#1a535c] text-white">
      {/* Animated Gradient Text */}
      <h1 className="text-5xl md:text-7xl font-bold gradient-text py-4">
        Coming Soon
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-lg md:text-xl text-center opacity-80">
        {`${page} section will be added very soon`}
      </p>

      {/* Decorative Animation */}
      <div className="mt-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#fd8f16] via-[#026f45] to-[#ffc120] animate-spin-slow shadow-2xl"></div>
    </div>
  );
};

export default ComingSoon;
