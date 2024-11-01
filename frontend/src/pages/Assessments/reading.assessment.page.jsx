import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Mic,
  Square,
  ThumbsUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changeLayout } from "../../features/layoutChangerSlice";
import {
  moveNextAssessment,
  selectAssessment,
} from "../../features/userOperationSlice";
import { Card, CardContent } from "@mui/material";
import Progress from "../../components/Progress";

export default function ReadingAssessmentPractice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [feedbackReceived, setFeedbackReceived] = useState(false);
  const { isProcessing, assessments, selectedAssessmentIndex } = useSelector(
    (state) => state.operation
  );

  const isErrorState = selectedAssessmentIndex === -1;
  const isLastAssessment = selectedAssessmentIndex === assessments?.length - 1;
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Set up timer when assessment index changes
  useEffect(() => {
    if (!isErrorState) {
      setTimeLeft(
        assessments[selectedAssessmentIndex].evaluationCriteria.timeToComplete
      );
    }
  }, [selectedAssessmentIndex, assessments, isErrorState]);

  // Warn user on page reload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage =
        "Are you sure you want to reload? You might lose your progress.";
      event.preventDefault();
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNext = () => {
    const newIndex = selectedAssessmentIndex + 1;
    dispatch(selectAssessment(newIndex));
    navigate(`/practice/reading/assessment/${newIndex + 1}`);
    setFeedbackReceived(false);
  };

  const handleBack = () => {
    dispatch(changeLayout());
    navigate("/practice/reading");
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setTimeLeft(
      assessments[selectedAssessmentIndex].evaluationCriteria.timeToComplete
    );
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopRecording();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingComplete(true);
    clearInterval(timerRef.current);
  };

  const analyzeRecording = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setFeedbackReceived(true);
    }, 3000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const difficultyColor = {
    easy: "bg-[#aada27] text-[#5c7b11]",
    medium: "bg-[#fdc324] text-[#7a5b00]",
    hard: "bg-[#fc900c] text-[#803d00]",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <main className="w-[90%] mx-auto py-6">
        {isErrorState ? (
          <div className="text-red-600 text-center">
            <h3>Error: Assessment Cancelled or Not Available</h3>
            <p>Please select a valid assessment to continue.</p>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row  gap-8">
            {/* Left Column - Passage */}
            <div className="flex-[3] bg-white rounded-lg shadow-md p-8">
              <div
                className={`mb-4 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  difficultyColor[
                    assessments[selectedAssessmentIndex].difficulty
                  ] || "bg-gray-200 text-gray-800"
                }`}
              >
                Difficulty: {assessments[selectedAssessmentIndex].difficulty}
              </div>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-gray-700">
                  {assessments[selectedAssessmentIndex].passage}
                </p>
              </div>
              {/* Feedback Display */}
              {feedbackReceived && (
                <div className="flex align-middle justify-center">
                  <Card className="mt-12 w-full max-w-md  bg-white shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        Feedback
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-medium text-gray-700">
                              Overall Score
                            </span>
                            <span className="text-2xl font-bold text-teal-600">
                              85/100
                            </span>
                          </div>
                          <Progress value={85} className="h-2 bg-gray-200" />
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Fluency:</strong> Good
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Pronunciation:</strong> Excellent
                          </span>
                        </div>
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-1" />
                          <span className="text-gray-700">
                            <strong>Areas for improvement:</strong> Work on
                            pacing and intonation for better expression.
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Right Column - Recording Interface */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">
                  Recording
                </h3>
                <p className="text-gray-600">
                  Click the microphone button to start/stop recording
                </p>
              </div>

              {/* Timer Display */}
              <div className="mb-6 text-4xl font-bold text-teal-600 bg-teal-50 px-6 py-3 rounded-full shadow-inner">
                {timeLeft > 0 ? `${timeLeft}s` : "Time's up!"}
              </div>

              {/* Microphone Button */}
              <button
                onClick={toggleRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-gradient-to-r from-orange-400 to-red-500 shadow-lg scale-110"
                    : "bg-gradient-to-r from-teal-400 to-teal-500"
                }`}
                disabled={isAnalyzing || feedbackReceived}
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
                <div className="mt-4 text-green-600 font-medium animate-pulse">
                  Recording in progress...
                </div>
              )}
              {!isRecording && recordingComplete && (
                <div className="mt-4 text-teal-600 font-medium">
                  Recording complete. You can now analyze.
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyzeRecording}
                className="mt-8 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg"
                disabled={!recordingComplete || isAnalyzing || feedbackReceived}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Recording"}
              </button>

              {/* Analysis Loading */}
              {isAnalyzing && (
                <div className="mt-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                  <div className="text-lg font-medium text-gray-700">
                    Analyzing your recording...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          <button
            onClick={handleBack} // Add click handler for navigation
            className="flex items-center px-4 py-2 border rounded-md transition-all duration-200  text-teal-600 border-teal-600 hover:bg-teal-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Main Page
          </button>
          <button
            onClick={handleNext} // Add click handler for navigation
            disabled={isErrorState || isLastAssessment} // Disable if in error state or last assessment
            className={`flex items-center px-4 py-2 bg-teal-600 rounded-md transition-all duration-200 
                ${
                  !isErrorState && !isLastAssessment
                    ? "hover:bg-teal-700 text-white"
                    : "bg-gray-300 cursor-not-allowed"
                }
                `}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
