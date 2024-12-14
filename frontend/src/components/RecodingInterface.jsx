import { Mic, Square } from "lucide-react";
import React from "react";

const RecordingInterface = ({
  toggleRecording,
  isRecording,
  isAnalyzing,
  feedbackReceived,
  recordingComplete,
  analyzeRecording,
  isDisabled=false
}) => {
  return (
    <div className=" md:sticky top-24 flex-1 max-h-fit flex flex-col items-center bg-white rounded-lg shadow-md p-8">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">Recording</h3>
        <p className="text-gray-600">
          Click the microphone button to start/stop recording
        </p>
      </div>

      {/* Microphone Button */}
      <button
        onClick={toggleRecording}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? "bg-gradient-to-r from-orange-400 to-red-500 shadow-lg scale-110"
            : "bg-gradient-to-r from-teal-400 to-teal-500"
        }`}
        disabled={isAnalyzing || feedbackReceived || recordingComplete || isDisabled}
      >
        {isRecording ? (
          <Square
            className="w-16 h-16 text-white animate-pulse"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
            }}
          />
        ) : (
          <Mic
            className="w-16 h-16 text-white"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
            }}
          />
        )}
      </button>

      {isRecording && (
        <div className="mt-4 text-green-600 font-medium animate-pulse text-center">
          Recording in progress...
        </div>
      )}
      {!isRecording && recordingComplete && (
        <div className="mt-4 text-teal-600 font-medium text-center">
          Recording complete. You can now analyze.
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={analyzeRecording}
        className={`mt-8 bg-teal-600  text-white px-8 py-3 text-lg
                   ${
                     !recordingComplete || isAnalyzing || feedbackReceived
                       ? " bg-teal-700 cursor-not-allowed"
                       : "hover:bg-teal-700"
                   }
                  
                  `}
        disabled={!recordingComplete || isAnalyzing || feedbackReceived || isDisabled}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Recording"}
      </button>
    </div>
  );
};
export default RecordingInterface;
