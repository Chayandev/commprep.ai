import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  CheckCircle2,
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
import { getReadingAssessmentAnslysis } from "../../../actions/user.actions";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import useFullScreen from "../../components/Hooks/FullScreenHook.js";
import TimeDisplay from "../../components/TimeDisplay.jsx";

export default function ReadingAssessmentPractice() {
  //useFullScreen();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [feedbackReceived, setFeedbackReceived] = useState(false);
  const { assessments, selectedAssessmentIndex } = useSelector(
    (state) => state.operation
  );
  const { isAnalyzing, result } = useSelector(
    (state) => state.assessmentAnalysis
  );

  const isErrorState = selectedAssessmentIndex === -1;
  const isLastAssessment = selectedAssessmentIndex === assessments?.length - 1;

  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeDisplayRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  useFullScreen();

  useEffect(() => {
    if (!isErrorState) {
      setTimeLeft(
        assessments[selectedAssessmentIndex].evaluationCriteria.timeToComplete
      );
    }
  }, [selectedAssessmentIndex, assessments, isErrorState]);

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
    //dispatch(changeLayout());
    navigate("/practice/reading");
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      const permission = await requestMicrophonePermission();
      if (permission) {
        startRecording();
      }
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (err) {
      console.error("Microphone permission denied", err);
      alert("Microphone access is required for this feature.");
      return false;
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setTimeLeft(
      assessments[selectedAssessmentIndex].evaluationCriteria.timeToComplete
    );

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        setRecordingComplete(true);
      };

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setRecordingComplete(true);
            stopRecording();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    clearInterval(timerRef.current);
  };

  const analyzeRecording = () => {
    if (!audioBlob) return;
    setProgress(10);
    const formData = new FormData();
    formData.append("assessmentID", assessments[selectedAssessmentIndex]._id);
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("passage", assessments[selectedAssessmentIndex].passage);

    dispatch(getReadingAssessmentAnslysis(formData))
      .unwrap()
      .then((result) => {
        console.log(result);
        setProgress(70);
        setFeedbackReceived(true);
      })
      .catch((error) => {
        // Show the error message as a toast error
        toast.error(
          error || "An error occurred during ReadingAssesment Analysis.",
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        console.error("Error during ReadingAssesment Analysis:", error);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const difficultyColor = {
    easy: "bg-[#aada27] text-[#5c7b11]",
    medium: "bg-[#fdc324] text-[#7a5b00]",
    hard: "bg-[#fc900c] text-[#803d00]",
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 120); // Adjust this value as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (result && feedbackReceived) {
    // Extract feedback and suggestions
    const feedbackLines = result?.feedback
      .split("#") // Split the feedback by period and space
      .filter((line) => line.trim() !== ""); // Remove any empty lines

    const suggestionLines = result?.suggestion
      .split("#") // Split the suggestions by period and space
      .filter((line) => line.trim() !== ""); // Remove any empty lines

    // Add a period at the end of the last line if it doesn't already have one
    if (
      feedbackLines?.length > 0 &&
      !feedbackLines[feedbackLines?.length - 1].endsWith(".")
    ) {
      feedbackLines[feedbackLines?.length - 1] += ".";
    }

    if (
      suggestionLines?.length > 0 &&
      !suggestionLines[suggestionLines?.length - 1].endsWith(".")
    ) {
      suggestionLines[suggestionLines?.length - 1] += ".";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <LoadingBar
        color="#02cbc3"
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <main className="w-[90%] m-auto block py-6">
        {isErrorState ? (
          <div className="text-red-600 text-center">
            <h3>Error: Assessment Cancelled or Not Available</h3>
            <p>Please select a valid assessment to continue.</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse xl:flex-row  gap-8">
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
                <h3 className="text-3xl font-bold mb-6 text-gray-800">{`Reading Assesment: ${
                  selectedAssessmentIndex + 1
                }`}</h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {assessments[selectedAssessmentIndex].passage}
                </p>
              </div>

              <div className="flex align-middle justify-center">
                {/* Analysis Loading */}
                {isAnalyzing && (
                  <div className="mt-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <div className="text-lg font-medium text-gray-700">
                      Analyzing your recording...
                    </div>
                  </div>
                )}
                {/* Feedback Display */}

                {feedbackReceived && (
                  <Card className="mt-8 w-full bg-white shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="text-2xl font-bold mb-6 text-gray-800">
                        Analysis Result
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-medium text-gray-700">
                              Overall Score
                            </span>
                            <span className="text-2xl font-bold text-teal-600">
                              {`${result.overallScore * 10}/100`}
                            </span>
                          </div>
                          <Progress
                            value={result.overallScore * 10}
                            className="h-3 rounded-full bg-gray-200"
                            indicatorClassName="bg-black"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">
                              Accuracy
                            </div>
                            <div
                              className={`text-lg font-semibold rounded-full px-3 py-1 inline-block ${
                                parseFloat(result.accuracy) < 60
                                  ? "bg-red-100 text-red-800"
                                  : parseFloat(result.accuracy) < 80
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {result.accuracy}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">
                              Confidence
                            </div>
                            <div
                              className={`text-lg font-semibold rounded-full px-3 py-1 inline-block ${
                                parseFloat(result.pronunciationConfidence) < 60
                                  ? "bg-red-100 text-red-800"
                                  : parseFloat(result.pronunciationConfidence) <
                                    80
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {result.pronunciationConfidence}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-1" />
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1">
                                Feedback
                              </h4>
                              <ul className="list-disc list-inside text-gray-600 text-sm font-semibold">
                                {feedbackLines.map((line, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-1" />
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1">
                                Suggestion
                              </h4>
                              <ul className="list-disc list-inside text-gray-600 text-sm font-semibold">
                                {suggestionLines.map((line, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Recording Interface */}
            <div className="sticky top-24 flex-1 flex flex-col items-center bg-white rounded-lg shadow-md p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">
                  Recording
                </h3>
                <p className="text-gray-600">
                  Click the microphone button to start/stop recording
                </p>
              </div>

              {/* <div
                className={`mb-6 text-4xl font-bold px-6 py-3 rounded-full shadow-inner ${
                  timeLeft > 10
                    ? "text-teal-600 bg-teal-50"
                    : timeLeft > 5
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {timeLeft > 0 ? `${timeLeft}s` : "Time's up!"}
              </div> */}

              {/* Timer Display */}
              <TimeDisplay
                ref={timeDisplayRef}
                timeLeft={timeLeft}
                isScrolled={isScrolled}
              />

              {/* Microphone Button */}
              <button
                onClick={toggleRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-gradient-to-r from-orange-400 to-red-500 shadow-lg scale-110"
                    : "bg-gradient-to-r from-teal-400 to-teal-500"
                }`}
                disabled={isAnalyzing || feedbackReceived || recordingComplete}
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
                className={`mt-8 bg-teal-600  text-white px-8 py-3 text-lg
                   ${
                     !recordingComplete || isAnalyzing || feedbackReceived
                       ? " bg-teal-700 cursor-not-allowed"
                       : "hover:bg-teal-700"
                   }
                  
                  `}
                disabled={!recordingComplete || isAnalyzing || feedbackReceived}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Recording"}
              </button>
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
