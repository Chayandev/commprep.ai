import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  ArrowRightLeft,
  PlusCircle,
  Mic,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { selectAssessment } from "../../features/userOperationSlice";
import { Card, CardContent, Typography } from "@mui/material";
import Progress from "../../components/Progress";
import Score from "../../components/Score.jsx";
import { getReadingAssessmentAnalysis } from "../../../actions/user.actions";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import TimeDisplay from "../../components/TimeDisplay.jsx";
import AssessmentError from "../../components/AssessmentError.jsx";
import TakeAssessmentHeader from "../../components/TakeAssessmentHeader.jsx";
import RecordingInterface from "../../components/RecodingInterface.jsx";
import useUnloadConfirmation from "../../components/Hooks/useReloadConfirmation.js";
import { requestMicrophonePermission } from "../../utils/microphonePermission.js";
import useScrollPosition from "../../components/Hooks/useScrollPosition.js";

export default function ReadingAssessmentPractice() {
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
  const isScrolled = useScrollPosition(80);

  useUnloadConfirmation(
    "Are you sure you want to reload? You might lose your progress."
  );

  useEffect(() => {
    if (!isErrorState && assessments && assessments[selectedAssessmentIndex]) {
      setAssessment(assessments[selectedAssessmentIndex]);
      setTimeLeft(
        assessments[selectedAssessmentIndex].evaluationCriteria?.timeToComplete || 60
      );
    }
  }, [selectedAssessmentIndex, assessments, isErrorState]);

  const handleNext = () => {
    const newIndex = selectedAssessmentIndex + 1;
    dispatch(selectAssessment(newIndex));
    navigate(`/practice/reading/assessment/${newIndex + 1}`);
    setFeedbackReceived(false);
  };

  const handleBack = () => navigate("/practice/reading");

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      const permission = await requestMicrophonePermission();
      if (permission) startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setTimeLeft(assessment?.evaluationCriteria?.timeToComplete || 60);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();

      const audioChunks = [];
      recorder.ondataavailable = (e) => audioChunks.push(e.data);
      recorder.onstop = () => {
        setAudioBlob(new Blob(audioChunks, { type: "audio/wav" }));
        setRecordingComplete(true);
      };

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) mediaRecorder.stop();
    clearInterval(timerRef.current);
  };

  const analyzeRecording = () => {
    if (!audioBlob || !assessment) return;
    setProgress(10);
    const formData = new FormData();
    formData.append("assessmentID", assessment._id);
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("passage", assessment.passage);

    dispatch(getReadingAssessmentAnalysis(formData))
      .unwrap()
      .then(() => {
        setProgress(70);
        setFeedbackReceived(true);
      })
      .catch((error) => {
        toast.error(error || "An error occurred during Reading Assessment Analysis.", {
          position: "top-center",
          autoClose: 3000,
        });
      })
      .finally(() => setProgress(100));
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ─── Derived result values ───────────────────────────────────────────────
  const overallScore    = result?.overallScore ?? 0;
  const wordAccuracy    = result?.wordAccuracy ?? {};
  const readingPace     = result?.readingPace ?? {};
  const clarity         = result?.clarity ?? {};
  const addedWords      = result?.addedWords ?? [];
  const feedback        = result?.feedback ?? "";
  const suggestion      = result?.suggestion ?? "";

  const wordAccScore    = wordAccuracy.score ?? 0;
  const clarityScore    = clarity.score ?? 0;
  const paceWPM         = readingPace.wpm ?? 0;
  const paceLabel       = readingPace.label ?? "";
  const missedWords     = wordAccuracy.missedWords ?? [];
  const changedWords    = wordAccuracy.changedWords ?? [];
  const lowClarityWords = clarity.lowClarityWords ?? [];
  const correctCount    = wordAccuracy.correct ?? 0;
  const totalWords      = wordAccuracy.total ?? 0;
  const totalIssues     = missedWords.length + changedWords.length + addedWords.length + lowClarityWords.length;

  const getOverallColorClass = (score) => {
    const num = parseFloat(score);
    if (num < 60) {
      return {
        text: "text-red-600",
        bar: "bg-red-500",
      };
    } else if (num < 80) {
      return {
        text: "text-yellow-600",
        bar: "bg-yellow-500",
      };
    } else {
      return {
        text: "text-green-600",
        bar: "bg-green-600",
      };
    }
  };

  const overallColorClass = getOverallColorClass(overallScore);

  return (
    <>
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
            {/* Header */}
            <div className="mb-8 bg-white border border-gray-300 rounded-lg shadow-sm">
              <div className="flex justify-between items-center p-6">
                <TakeAssessmentHeader
                  title={
                    assessment?.title ||
                    `Reading Assessment ${selectedAssessmentIndex + 1}`
                  }
                  assessment={assessment}
                />
                {timeLeft !== null && (
                  <TimeDisplay
                    ref={timeDisplayRef}
                    timeLeft={timeLeft}
                    isScrolled={isScrolled}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-8">
              {/* Left Column */}
              <div className="flex-[3] bg-white rounded-lg shadow-md p-8">
                <Typography
                  variant="h4"
                  style={{ fontWeight: 600 }}
                  className="text-black"
                >
                  Reading Passage
                </Typography>
                <Typography
                  variant="subtitle1"
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
                  {feedbackReceived && result && (
                    <Card className="mt-8 w-full bg-white shadow-lg">
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">
                          Analysis Result
                        </h3>
                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div>
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-medium text-gray-700">
                                  Overall Score
                                </span>
                                <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-200">
                                  60% Accuracy + 25% Clarity + 15% Pace
                                </span>
                              </div>
                              <span className={`text-2xl font-bold ${overallColorClass.text}`}>
                                {`${overallScore}/100`}
                              </span>
                            </div>
                            <Progress
                              value={overallScore}
                              className="h-3 rounded-full bg-gray-200"
                              indicatorClassName={overallColorClass.bar}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {correctCount} of {totalWords} words aligned ({wordAccScore}% accuracy)
                              {paceWPM > 0 && ` • Pace: ${paceWPM} WPM (${paceLabel})`}
                            </p>
                          </div>

                          {/* Scores Grid using theme Score component */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Score
                              title="Word Accuracy"
                              score={`${wordAccScore}%`}
                              thresholds={{ low: 60, high: 80 }}
                              pill="60% Weight"
                              description="Words matched correctly against passage"
                            />
                            <Score
                              title="Pronunciation Score"
                              score={`${clarityScore}%`}
                              thresholds={{ low: 60, high: 80 }}
                              pill="25% Weight"
                              description="Speech clarity & phoneme recognition"
                            />
                            <Score
                              title="Reading Pace"
                              score={`${paceWPM} WPM`}
                              thresholds={{ low: 90, high: 130 }}
                              pill="15% Weight"
                              description="Reading speed (120–160 WPM optimal)"
                            />
                          </div>

                          {/* Audio Player - Listen to your reading */}
                          {(result?.audioUrl || audioBlob) && (
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Volume2 className="w-4 h-4 text-teal-600" />
                                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                  Listen to Your Recording
                                </span>
                              </div>
                              <audio
                                src={result?.audioUrl || (audioBlob ? URL.createObjectURL(audioBlob) : "")}
                                controls
                                className="w-full h-9 rounded outline-none"
                              />
                            </div>
                          )}

                          {/* Word Breakdown (Clean, theme-specific card) */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-gray-800 text-sm">
                                Word Breakdown
                              </h4>
                              {totalIssues === 0 && (
                                <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                                  ✓ No issues found
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {/* Missed Words */}
                              <div className="bg-white p-3 rounded-md border border-gray-200">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mb-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Missed Words ({missedWords.length})</span>
                                </div>
                                {missedWords.length === 0 ? (
                                  <span className="text-xs text-gray-400">None</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {missedWords.map((w, i) => (
                                      <span
                                        key={i}
                                        className="text-xs font-medium px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200"
                                      >
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Said Differently */}
                              <div className="bg-white p-3 rounded-md border border-gray-200">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1">
                                  <ArrowRightLeft className="w-3.5 h-3.5" />
                                  <span>Said Differently ({changedWords.length})</span>
                                </div>
                                {changedWords.length === 0 ? (
                                  <span className="text-xs text-gray-400">None</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {changedWords.map((w, i) => (
                                      <span
                                        key={i}
                                        className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                                      >
                                        "{w.expected}" → "{w.spoke}"
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Extra Added */}
                              <div className="bg-white p-3 rounded-md border border-gray-200">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>Extra Words ({addedWords.length})</span>
                                </div>
                                {addedWords.length === 0 ? (
                                  <span className="text-xs text-gray-400">None</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {addedWords.map((w, i) => (
                                      <span
                                        key={i}
                                        className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                                      >
                                        +{w}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Unclear */}
                              <div className="bg-white p-3 rounded-md border border-gray-200">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 mb-1">
                                  <Mic className="w-3.5 h-3.5" />
                                  <span>Low Clarity ({lowClarityWords.length})</span>
                                </div>
                                {lowClarityWords.length === 0 ? (
                                  <span className="text-xs text-gray-400">None</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {lowClarityWords.map((w, i) => (
                                      <span
                                        key={i}
                                        className="text-xs font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200"
                                      >
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Feedback */}
                          {feedback && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-1 shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-1">
                                    Feedback
                                  </h4>
                                  <p className="text-gray-600 text-sm font-semibold">
                                    {feedback}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Suggestion */}
                          {suggestion && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                              <div className="flex items-start">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-1 shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-1">
                                    Suggestion
                                  </h4>
                                  <p className="text-gray-600 text-sm font-semibold">
                                    {suggestion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Try again */}
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => {
                                setFeedbackReceived(false);
                                setRecordingComplete(false);
                                setAudioBlob(null);
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 text-sm font-medium transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Try Again
                            </button>
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
            onClick={handleBack}
            className="flex items-center px-4 py-2 border rounded-md transition-all duration-200 text-teal-600 border-teal-600 hover:bg-teal-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Main Page
          </button>
          <button
            onClick={handleNext}
            disabled={isErrorState || isLastAssessment}
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
    </>
  );
}
