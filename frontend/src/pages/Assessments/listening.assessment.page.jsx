import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Progress from "../../components/Progress"; // Assuming Progress component is defined
import { ChevronRight, Play, Pause, Loader2, ChevronLeft } from "lucide-react";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
// Assuming Textarea component is defined
import TextArea from "../../components/TextArea";
import { useNavigate } from "react-router-dom";
import { getListeningAssessmentAnalysis } from "../../../actions/user.actions";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import TakeAssessmentHeader from "../../components/TakeAssessmentHeader";
import TimeDisplay from "../../components/TimeDisplay";
import AssessmentError from "../../components/AssessmentError";

export default function ListeningAssessmentPractice() {
  const navigate = useNavigate();
  const { assessments, selectedAssessmentIndex } = useSelector(
    (state) => state.operation
  );
  const { isAnalyzing, result } = useSelector(
    (state) => state.assessmentAnalysis
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [assessmentTime, setAssessmentTime] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [feedback, setFeedback] = useState(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [AUDIO_DURATION, setAudioDuration] = useState(0);
  const [TOTAL_TIME, setTotalTime] = useState(0);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const [assessment, setAssessment] = useState(null);
  const isErrorState = selectedAssessmentIndex === -1;
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeDisplayRef = useRef(null);

  const dispatch = useDispatch();
  // Extract data from the selected assessment
  useEffect(() => {
    if (!isErrorState) setAssessment(assessments[selectedAssessmentIndex]);
  }, [isErrorState]);

  //Fetch audio duration and set total assessment time
  const AUDIO_URL = assessment?.audioFileUrl; // URL of the audio from Cloudinary
  const mcqQuestions = assessment?.mcqQuestions || [];
  const saqQuestions = assessment?.saqQuestions || [];
  const questions = [...mcqQuestions, ...saqQuestions];

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const audioElement = new Audio(AUDIO_URL);

        audioElement.onloadedmetadata = () => {
          try {
            const audioDuration = audioElement?.duration || 0;
            setAudioDuration(audioDuration);

            const evaluationTime =
              assessment?.evaluationCriteria?.timeToComplete || audioDuration; // Use audio duration if timeToComplete is missing
            setAssessmentTime(evaluationTime);
            setIsAudioLoaded(true);
            setTotalTime(evaluationTime);
          } catch (innerError) {
            console.error("Error processing audio metadata:", innerError);
            toast.error(
              "An issue occurred while processing audio metadata. Please try again.",
              {
                position: "top-center",
                autoClose: 2000,
              }
            );
          }
        };

        // Handle network errors or unsupported operations
        audioElement.onerror = (e) => {
          console.error("Audio failed to load:", e);
          toast.error(
            "Failed to load audio. Please check your internet connection.",
            {
              position: "top-center",
              autoClose: 2000,
            }
          );
        };
      } catch (error) {
        console.error("Error loading audio:", error);
        toast.error("Failed to load audio. Please try again later.", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    };

    if (AUDIO_URL) loadAudio();
  }, [AUDIO_URL, assessment]);

  const togglePlayPause = async () => {
    try {
      if (!isAudioLoaded) {
        throw new Error("Audio not loaded yet.");
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error during audio playback:", error);
      toast.error("Audio playback failed. Please try again.");
    }
  };

  useEffect(() => {
    if (isAudioLoaded) {
      startAssessmentTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAudioLoaded]);

  const startAssessmentTimer = () => {
    timerRef.current = setInterval(() => {
      setAssessmentTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerRef.current);
          //if (isAudioLoaded) handleSubmit();
          //return assessmentTime;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  const formatTime = (seconds) => {
    // Round the seconds to remove any fractional values
    const roundedSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    // Format the time as "minutes:seconds"
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (audioRef.current) audioRef.current.pause();
    if (timerRef.current) clearInterval(timerRef.current);
    console.log("Submitting answers:", answers);

    if (!answers && answers.length < 0) {
      toast.error("Answers are missing or invalid");
      return;
    }

    dispatch(
      getListeningAssessmentAnalysis({
        answers: answers,
        assessmentID: assessment._id,
      })
    )
      .unwrap()
      .then((result) => {
        console.log(result);
        setProgress(70);
        // setFeedback(result);
      })
      .catch((error) => {
        // Show the error message as a toast error
        toast.error(error || "An error occurred during Listening Analysis.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error during ListeningAssessment Analysis:", error);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  const handleBack = () => {
    navigate("/practice/listening");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Adjust this value as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercentage = (answeredQuestionsCount / totalQuestions) * 100;
  const difficultyColor = {
    easy: "bg-[#aada27] text-[#5c7b11]",
    medium: "bg-[#fdc324] text-[#7a5b00]",
    hard: "bg-[#fc900c] text-[#803d00]",
  };

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
          assessment && (
            <>
              <div className="mb-8 bg-white border border-gray-300 rounded-lg shadow-sm">
                <div className=" flex  justify-between items-center p-6">
                  <TakeAssessmentHeader
                    title={assessment?.title}
                    assessment={assessment}
                  />
                  {isAudioLoaded && assessmentTime ? (
                    <TimeDisplay
                      ref={timeDisplayRef}
                      timeLeft={assessmentTime}
                      isScrolled={isScrolled}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse lg:flex-row gap-8">
                {/* Left Column - Audio Player and Questions */}
                <div className="flex-1 bg-white rounded-lg shadow-md p-8">
                  <div className="bg-teal-600 mb-8 rounded-lg shadow-md">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={togglePlayPause}
                          className={`bg-teal-500 hover:bg-teal-700 text-white px-4 py-3 rounded-md ${
                            isAudioPlayedOnce
                              ? "bg-teal-700 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={!isAudioLoaded || isAudioPlayedOnce}
                        >
                          {!isAudioLoaded ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </button>
                        <div className="text-white font-medium">
                          {formatTime(audioCurrentTime)} /{" "}
                          {formatTime(AUDIO_DURATION)}
                        </div>
                      </div>
                      <Progress
                        value={audioProgress}
                        className="h-2 rounded-full  bg-teal-200"
                        indicatorClassName={
                          audioProgress == 100 ? "bg-teal-500" : "bg-secondary"
                        }
                      />

                      <audio
                        ref={audioRef}
                        src={AUDIO_URL}
                        onLoadedData={() => {
                          setIsAudioLoaded(true);
                        }}
                        onTimeUpdate={() => {
                          const current = audioRef.current.currentTime;
                          const newProgress = (current / AUDIO_DURATION) * 100;
                          setAudioProgress(newProgress);
                          console.log(newProgress); // Check the value of newProgress
                          setAudioCurrentTime(Math.floor(current));
                        }}
                        onEnded={() => {
                          setIsPlaying(false);
                          setIsAudioPlayedOnce(true); // Set to true when audio ends
                        }}
                      />
                    </div>
                  </div>
                  {/* // In your component's return block */}
                  {!isSubmitted ? (
                    <>
                      <div className="mb-4 inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                        Question {currentQuestion + 1} of {questions.length}
                      </div>

                      <div className="prose max-w-full">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                          {questions[currentQuestion]?.question}
                        </h2>

                        {questions[currentQuestion]?.options ? (
                          <RadioGroup
                            onChange={(e) =>
                              handleAnswerChange(
                                currentQuestion,
                                e.target.value
                              )
                            }
                            value={answers[currentQuestion] || ""}
                          >
                            {questions[currentQuestion]?.options.map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center space-x-2 mb-4 w-full"
                                >
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        sx={{
                                          color: "#00897B", // Equivalent to teal-600
                                          "&.Mui-checked": {
                                            color: "#00897B", // Keeps radio teal when checked
                                          },
                                        }}
                                      />
                                    }
                                    label={option}
                                    value={option}
                                    sx={{
                                      "& .MuiFormControlLabel-label": {
                                        color: "#4A4A4A", // text-gray-700
                                        fontSize: "1.125rem", // text-lg (equivalent to 18px)
                                        cursor: "pointer", // cursor-pointer
                                        padding: "0.5rem", // p-2 (8px padding)
                                        borderRadius: "0.375rem", // rounded-md
                                        width: "100%", // w-full
                                        transition: "background-color 0.3s", // transition-colors
                                        "&:hover": {
                                          backgroundColor: "#E0F2F1", // hover:bg-teal-50
                                        },
                                      },
                                    }}
                                    className="text-lg w-full"
                                  />
                                </div>
                              )
                            )}
                          </RadioGroup>
                        ) : (
                          <div>
                            <TextArea
                              placeholder="Type your answer here..."
                              className="w-full p-4 border-teal-600 rounded-md text-lg"
                              onChange={(e) =>
                                handleAnswerChange(
                                  currentQuestion,
                                  e.target.value
                                )
                              }
                              value={answers[currentQuestion] || ""}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="prose max-w-none">
                      {isAnalyzing && result ? (
                        <div className="flex flex-col items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                          <p className="mt-4 text-xl text-gray-600">
                            Analyzing your responses...
                          </p>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Assessment Results
                          </h2>
                          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
                            <p className="text-xl font-semibold text-teal-800">
                              {`Your Score: ${result?.score} out of ${questions.length}`}
                            </p>
                          </div>
                          <div className="mb-6">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-700">
                              Feedback
                            </h3>
                            <p className="text-gray-600">{result?.feedback}</p>
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold mb-2 text-gray-700">
                              Suggestion for Improvement
                            </h3>
                            <p className="text-gray-600">
                              {result?.suggestions}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-end">
                    {currentQuestion < questions.length - 1 ? (
                      <button
                        className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className={`flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md
                          ${isSubmitted ? "cursor-not-allowed bg-teal-700" : ""}
                          `}
                        onClick={handleSubmit}
                      >
                        {!isSubmitted ? "Submit" : "Submited"}
                      </button>
                    )}
                  </div>
                  {result && (
                    <div className="mt-8 w-full bg-teal-50 border border-teal-500 rounded-lg shadow-sm">
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4 text-teal-800">
                          Assessment Completed!
                        </h3>
                        <p className="text-teal-600">
                          Thank you for completing the listening assessment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Right Column - Instructions and Progress */}
                <div className="flex-1 flex flex-col items-center justify-start bg-white rounded-lg shadow-md p-8">
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">
                      Listening Assessment
                    </h3>
                    <p className="text-gray-600">
                      Listen to the audio and answer the questions
                    </p>
                  </div>

                  <div className="w-full max-w-md mb-8">
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">
                      Instructions:
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>Click the play button to start the audio</li>
                      <li>
                        You have {formatTime(TOTAL_TIME)} minutes to complete
                        the assessment
                      </li>
                      <li>Answer all questions to the best of your ability</li>
                      <li>
                        Click submit when you're finished or when time runs out
                      </li>
                      <li>Don't Refresh the page when assessment is runnign</li>
                    </ul>
                  </div>

                  {/* Circular Timer
                {isAudioLoaded ? (
                  <div className="relative w-48 h-48 mb-8">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="47"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className={`${getTimerColor()} transition-all duration-3000 ease-in-out`}
                        strokeWidth="4"
                        strokeDasharray={47 * 2 * Math.PI}
                        strokeDashoffset={
                          47 * 2 * Math.PI * (1 - assessmentTime / TOTAL_TIME)
                        }
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="47"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getTimerColor()} ${
                        assessmentTime <= 10 ? "animate-pulse" : ""
                      }`}
                    >
                      {assessmentTime > 0
                        ? formatTime(assessmentTime)
                        : "Times Up"}
                    </div>
                  </div>
                ) : (
                  ""
                )} */}

                  <div className="w-full flex flex-col ">
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">
                      Your Progress:
                    </h4>
                    <Progress
                      value={progressPercentage}
                      className="h-2 bg-gray-200 rounded-md"
                      indicatorClassName="bg-black"
                    />
                    <p className="text-right mt-2 text-gray-600">
                      {answeredQuestionsCount} of {totalQuestions} questions
                      answered
                    </p>
                  </div>
                </div>
              </div>
            </>
          )
        )}
        <div className="w-full flex justify-center">
          <button
            onClick={handleBack} // Add click handler for navigation
            className={`flex mt-8 items-center justify-center px-4 py-2 border rounded-md transition-all duration-200  text-teal-600 border-teal-600 hover:bg-teal-50 ${
              isAnalyzing ? "cursor-not-allowed" : ""
            }`}
            disabled={isAnalyzing}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Main Page
          </button>
        </div>
      </main>
    </div>
  );
}
