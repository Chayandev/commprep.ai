import React from "react";

export default function ShimmerCard() {
  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="max-w-40 min-h-4 bg-gray-300/50  overflow-hidden relative">
        <div className="absolute inset-0 -inset-x-full z-10 h-full w-[200%] animate-shimmer bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>
      <div className="w-full min-h-4 bg-gray-300/50  overflow-hidden relative">
        <div className="absolute inset-0 -inset-x-full z-10 h-full w-[200%] animate-shimmer bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>
    </div>
  );
}
