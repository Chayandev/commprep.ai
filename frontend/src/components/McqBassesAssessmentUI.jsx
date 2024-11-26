import React from "react";
import { FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import Progress from "./Progress";
import { useSelector } from "react-redux";

const McqBasedAssessmentUi = ({
  assessmentName,
  questions,
  handleSubmit,
  layout,
  setLayout,
  currentQuestion,
  setCurrentQuestion,
  isSubmitted,
  answers,
  handleAnswerChange,
  answeredQuestionsCount,
}) => {
  const { isAnalyzing, result } = useSelector(
    (state) => state.assessmentAnalysis
  );

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
                isSubmitted &&
                !isAnalyzing &&
                optionIndex ===
                  result?.assessment?.mcqQuestions[index]?.correctOption
                  ? "bg-green-100"
                  : isSubmitted && answers[index] === option
                  ? "bg-red-100"
                  : ""
              }`}
            />
            {isSubmitted && !isAnalyzing ? (
              optionIndex ===
              result?.assessment?.mcqQuestions[index]?.correctOption ? (
                <CheckCircle2 className="text-green-500 h-5 w-5" />
              ) : (
                answers[index] === option && (
                  <XCircle className="text-red-500 h-5 w-5" />
                )
              )
            ) : (
              ""
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8">
      {/* Left column */}
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
              isSubmitted && !isAnalyzing ? (
                <div>
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
                    <p className="text-xl font-semibold text-teal-800">
                      Your score: {result?.score} out of {questions?.length}
                    </p>
                  </div>

                  {questions?.map((question, index) =>
                    renderQuestion(question, index)
                  )}
                </div>
              ) : (
                renderQuestion(questions[currentQuestion], currentQuestion)
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
                        Math.min(questions?.length - 1, currentQuestion + 1)
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
        {isSubmitted ? (
          isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
              <p className="mt-4 text-xl text-gray-600">
                Analyzing your responses...
              </p>
            </div>
          ) : (
            result && (
              <div className="mt-8 w-full bg-teal-50 border border-teal-500 rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-teal-800">
                    Assessment Completed!
                  </h3>
                  <p className="text-teal-600">
                    Thank you for completing the {assessmentName} assessment.
                  </p>
                </div>
              </div>
            )
          )
        ) : (
          ""
        )}
      </div>

      {/* Right Column - Timer and Instructions */}
      <div className="lg:w-1/3">
        <div className="sticky top-24 bg-white rounded-lg shadow-md p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Instructions:
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Read each question carefully and choose the best answer.</li>
            <li>
              You can switch between card and list view using the toggle at the
              top.
            </li>
            <li>
              In card view, use the Next and Previous buttons to navigate
              between questions.
            </li>
            <li>
              Click Submit when you've answered all questions or when time runs
              out.
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
              {answeredQuestionsCount} of {questions?.length} questions answered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default McqBasedAssessmentUi;
