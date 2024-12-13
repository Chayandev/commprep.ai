import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { selectAssessment } from "../../features/userOperationSlice";
import { Card, CardContent, Typography } from "@mui/material";
import Progress from "../../components/Progress";
import { getReadingAssessmentAnslysis } from "../../../actions/user.actions";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import useFullScreen from "../../components/Hooks/FullScreenHook.js";
import TimeDisplay from "../../components/TimeDisplay.jsx";
import AssessmentError from "../../components/AssessmentError.jsx";
import TakeAssessmentHeader from "../../components/TakeAssessmentHeader.jsx";
import RecordingInterface from "../../components/RecodingInterface.jsx";
import useUnloadConfirmation from "../../components/Hooks/useReloadConfirmation.js";
import { requestMicrophonePermission } from "../../utils/microphonePermission.js";
import useScrollPosition from "../../components/Hooks/useScrollPosition.js";

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
  const [assessment, setAssessment] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timeDisplayRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  //Use the custom hook to set the scrolling
  const isScrolled = useScrollPosition(80);
  // Use the custom hook to display the unload confirmation message
  useUnloadConfirmation(
    "Are you sure you want to reload? You might lose your progress."
  );

  //useFullScreen();

  useEffect(() => {
    if (!isErrorState) {
      setAssessment(assessments[selectedAssessmentIndex]);
      setTimeLeft(
        assessments[selectedAssessmentIndex].evaluationCriteria.timeToComplete
      );
    }
  }, [selectedAssessmentIndex, assessments, isErrorState]);

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

  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setTimeLeft(
      assessment.evaluationCriteria.timeToComplete
      //assessments[selectedAssessmentIndex].evaluationCriteria.timeToComplete
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
    formData.append("assessmentID", assessment._id);
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("passage", assessment.passage);

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

  //if (result && feedbackReceived) {
  // Extract feedback and suggestions safely with defaults
  const feedbackLines = result?.feedback
    ? result.feedback
        .split("#") // Split feedback by "#"
        .map((line) => line.trim()) // Trim extra spaces
        .filter((line) => line !== "") // Remove empty lines
        .map((line, index, array) => {
          // Add a period if the last line doesn't have one
          if (index === array.length - 1 && !line.endsWith(".")) {
            return `${line}.`;
          }
          return line;
        })
    : []; // Default to an empty array if feedback is missing

  const suggestionLines = result?.suggestion
    ? result.suggestion
        .split("#") // Split suggestions by "#"
        .map((line) => line.trim()) // Trim extra spaces
        .filter((line) => line !== "") // Remove empty lines
        .map((line, index, array) => {
          // Add a period if the last line doesn't have one
          if (index === array.length - 1 && !line.endsWith(".")) {
            return `${line}.`;
          }
          return line;
        })
    : []; // Default to an empty array if suggestions are missing

  //}

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
          <AssessmentError />
        ) : (
          <>
            <div className="mb-8 bg-white border border-gray-300 rounded-lg shadow-sm">
              <div className=" flex  justify-between items-center p-6">
                <TakeAssessmentHeader
                  title={
                    assessment?.title ||
                    `Reading Assessment ${selectedAssessmentIndex + 1}`
                  }
                  assessment={assessment}
                />
                {/* Timer Display */}
                {timeLeft!==null && (
                  <TimeDisplay
                    ref={timeDisplayRef}
                    timeLeft={timeLeft}
                    isScrolled={isScrolled}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row  gap-8">
              {/* Left Column - Passage */}
              <div className="flex-[3] bg-white rounded-lg shadow-md p-8">
                <Typography
                  variant="h4"
                  style={{ fontWeight: 600 }}
                  className="text-black"
                >
                  Reading Passage
                </Typography>
                <Typography
                  variant="h7"
                  style={{ fontWeight: 400 }}
                  className="text-gray-400 my-1"
                >
                  Read the following text carefully
                </Typography>
                <div className="max-w-none border border-gray-200 mt-6 p-4 rounded-md">
                  <p className="text-lg leading-relaxed text-gray-900">
                    {assessment?.passage}
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
                                  parseFloat(result.pronunciationConfidence) <
                                  60
                                    ? "bg-red-100 text-red-800"
                                    : parseFloat(
                                        result.pronunciationConfidence
                                      ) < 80
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
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
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
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
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
              <RecordingInterface
                toggleRecording={toggleRecording}
                isRecording={isRecording}
                isAnalyzing={isAnalyzing}
                feedbackReceived={feedbackReceived}
                recordingComplete={recordingComplete}
                analyzeRecording={analyzeRecording}
              />
            </div>
          </>
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
            Next Assessment <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
