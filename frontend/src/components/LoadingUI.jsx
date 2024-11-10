import React, { useEffect, useState } from "react";

const LoadingUI = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-ping opacity-20"></div>
      </div>
      <h2 className="text-2xl font-bold text-foreground">Loading{dots}</h2>
      <p className="text-muted-foreground text-center">
        Please wait while we fetch your data
      </p>
      <div className="w-full bg-muted rounded-full h-2.5 dark:bg-muted">
        <div className="bg-primary h-2.5 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default LoadingUI;
