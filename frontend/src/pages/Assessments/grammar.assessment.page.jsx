import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import TakeAssessmentHeader from "../../components/TakeAssessmentHeader";
import TimeDisplay from "../../components/TimeDisplay";
import { FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import Progress from "../../components/Progress";

export default function GrammarAssessmentPractice() {
  const navigate = useNavigate();
  const { assessments, selectedAssessmentIndex } = useSelector(
    (state) => state.operation
  );
  const [assessment, setAssessment] = useState(null);
  const isErrorState = selectedAssessmentIndex === -1;
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeDisplayRef = useRef(null);
  const timerRef = useRef(null);
  const timeRef = useRef(null); // Ref to store the latest assessment time
  const [TOTAL_TIME, setTotalTime] = useState(0);
  const [assessmentTime, setAssessmentTime] = useState(0);
  const dispatch = useDispatch();

  const [layout, setLayout] = useState("card"); // 'card' or 'list'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState(null);
  const answeredQuestionsCount = Object.keys(answers).length;
  // Extract data from the selected assessment
  useEffect(() => {
    if (!isErrorState) {
      setAssessment(assessments[selectedAssessmentIndex]);
      const evaluationTime =
        assessments[selectedAssessmentIndex]?.evaluationCriteria
          ?.timeToComplete || 0;
      setAssessmentTime(evaluationTime); // Ensure the assessment time doesn't exceed the audio duration
      setTotalTime(evaluationTime);
    }
  }, [isErrorState, assessments, selectedAssessmentIndex]);

  useEffect(() => {
    timeRef.current = assessmentTime; // Update the ref whenever the assessment time changes
  }, [assessmentTime]);

  const startAssessmentTimer = () => {
    timerRef.current = setInterval(() => {
      setAssessmentTime((prevTime) => {
        if (timeRef.current === 0) {
          clearInterval(timerRef.current);
          // Handle when time is up
          console.log("Time's up!");
          return 0;
        }
        return timeRef.current - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isErrorState && assessmentTime > 0) {
      startAssessmentTimer();
      setQuestions(assessment.mcqQuestions);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isErrorState, assessmentTime]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Adjust this value as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.options[q.correctOption]) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    // handle submit
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitted(true);
  };
  const renderQuestion = (question, index) => (
    <div
      key={index}
      className={layout === "card" ? "" : "mb-8 pb-8 border-b last:border-b-0"}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {question.question}
      </h3>

      <RadioGroup
        onChange={(e) => handleAnswerChange(index, e.target.value)}
        value={answers[index] || ""}
      >
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="flex w-full items-center space-x-2 mb-2"
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
                  width: "100%", // Full width for hover effect
                  color: "#4A4A4A", // text-gray-700
                  fontSize: "1.125rem", // text-lg (equivalent to 18px)
                  cursor: "pointer", // cursor-pointer
                  padding: "0.5rem", // p-2 (8px padding)
                  borderRadius: "0.375rem", // rounded-md
                  transition: "background-color 0.3s", // transition-colors
                  "&:hover": {
                    backgroundColor: "#E0F2F1", // hover:bg-teal-50
                  },
                },
              }}
              id={`q${index}-option${optionIndex}`}
              disabled={isSubmitted}
              className={`text-lg w-full ${
                isSubmitted && optionIndex === question.correctOption
                  ? "bg-green-100"
                  : isSubmitted && answers[index] === option
                  ? "bg-red-100"
                  : ""
              }`}
            />

            {isSubmitted &&
              (option === question.correctAnswer ? (
                <CheckCircle2 className="text-green-500 h-5 w-5" />
              ) : (
                answers[index] === option && (
                  <XCircle className="text-red-500 h-5 w-5" />
                )
              ))}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
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
          <>
            <div className="mb-8 bg-white border border-gray-300 rounded-lg shadow-sm">
              <div className=" flex  justify-between items-center p-6">
                <TakeAssessmentHeader
                  title={
                    assessment?.title ||
                    `Grammer Assessment ${selectedAssessmentIndex + 1}`
                  }
                  assessment={assessment}
                />
                <TimeDisplay
                  ref={timeDisplayRef}
                  timeLeft={assessmentTime}
                  isScrolled={isScrolled}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-8">
              {/* left column */}
              <div className="flex-1 bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="layout-switch"
                    className="text-sm font-medium text-gray-700"
                  >
                    {layout === "card" ? "Card" : "List"} View
                  </label>
                  <Switch
                    id="layout-switch"
                    checked={layout === "list"}
                    onChange={(event) =>
                      setLayout(event.target.checked ? "list" : "card")
                    }
                  />
                </div>
                {questions && questions.length > 0 && (
                  <div>
                    {layout === "card" ? (
                      isSubmitted ? (
                        <div>
                          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
                            <p className="text-xl font-semibold text-teal-800">
                              Your score: {calculateScore()} out of{" "}
                              {questions?.length}
                            </p>
                          </div>

                          {questions?.map((question, index) =>
                            renderQuestion(question, index)
                          )}
                        </div>
                      ) : (
                        renderQuestion(
                          questions[currentQuestion],
                          currentQuestion
                        )
                      )
                    ) : (
                      <div className="w-full">
                        {questions?.map((question, index) =>
                          renderQuestion(question, index)
                        )}
                      </div>
                    )}

                    {!isSubmitted && layout === "card" && (
                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() =>
                            setCurrentQuestion(Math.max(0, currentQuestion - 1))
                          }
                          disabled={currentQuestion === 0}
                          className="text-teal-600 border border-teal-600 px-4 py-2 rounded-md hover:bg-teal-50"
                        >
                          Previous
                        </button>
                        {currentQuestion < questions?.length - 1 ? (
                          <button
                            onClick={() =>
                              setCurrentQuestion(
                                Math.min(
                                  questions?.length - 1,
                                  currentQuestion + 1
                                )
                              )
                            }
                            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    )}

                    {!isSubmitted && layout === "list" && (
                      <div className="mt-6 flex justify-center w-full">
                        <button
                          onClick={handleSubmit}
                          className=" bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md w-full"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {isSubmitted && (
                  <div className="mt-8 w-full bg-teal-50 border border-teal-500 rounded-lg shadow-sm">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-teal-800">
                        Assessment Completed!
                      </h3>
                      <p className="text-teal-600">
                        Thank you for completing the grammer assessment.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Right Column - Timer and Instructions */}
              <div className="lg:w-1/3">
                <div className="sticky top-24 bg-white rounded-lg shadow-md p-8 flex flex-col">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Instructions:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>
                      Read each question carefully and choose the best answer.
                    </li>

                    <li>
                      You can switch between card and list view using the toggle
                      at the top.
                    </li>
                    <li>
                      In card view, use the Next and Previous buttons to
                      navigate between questions.
                    </li>
                    <li>
                      Click Submit when you've answered all questions or when
                      time runs out.
                    </li>
                  </ul>

                  <div className="mt-4 flex flex-col">
                    <h4 className="text-xl font-semibold mb-2 text-gray-700">
                      Your Progress:
                    </h4>
                    <Progress
                      value={(answeredQuestionsCount / questions?.length) * 100}
                      className="h-2 bg-gray-200 rounded-md"
                      indicatorClassName="bg-black"
                    />
                    <p className="text-right mt-2 text-gray-600">
                      {answeredQuestionsCount} of {questions?.length} questions
                      answered
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <button
                // onClick={handleBack} // Add click handler for navigation
                className={`flex mt-8 items-center justify-center px-4 py-2 border rounded-md transition-all duration-200  text-teal-600 border-teal-600 hover:bg-teal-50 
                }`}
                //disabled={isAnalyzing}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Main Page
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
