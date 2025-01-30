import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import TakeAssessmentHeader from "../../components/TakeAssessmentHeader";
import TimeDisplay from "../../components/TimeDisplay";
import { ChevronLeft } from "lucide-react";
import { getGrammarAssessmentAnalysis } from "../../../actions/user.actions";
import { toast } from "react-toastify";
import AssessmentError from "../../components/AssessmentError";
import McqBasedAssessmentUi from "../../components/McqBassesAssessmentUI";
import useScrollPosition from "../../components/Hooks/useScrollPosition";
import useUnloadConfirmation from "../../components/Hooks/useReloadConfirmation";

export default function GrammarAssessmentPractice() {
  const navigate = useNavigate();
  const { assessments, selectedAssessmentIndex } = useSelector(
    (state) => state.operation
  );
  const { isAnalyzing } = useSelector((state) => state.assessmentAnalysis);
  const [assessment, setAssessment] = useState(null);
  const isErrorState = selectedAssessmentIndex === -1;
  const [progress, setProgress] = useState(0);
  //Use the custom hook to set the scrolling
  const isScrolled = useScrollPosition(80);
  const timeDisplayRef = useRef(null);
  const timerRef = useRef(null);
  const timeRef = useRef(null); // Ref to store the latest assessment time
  //const [TOTAL_TIME, setTotalTime] = useState(0);
  const [assessmentTime, setAssessmentTime] = useState(null);
  const dispatch = useDispatch();

  const [layout, setLayout] = useState("card"); // 'card' or 'list'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState(null);
  const answeredQuestionsCount = Object.keys(answers).length;

  // Use the custom hook to display the unload confirmation message
  useUnloadConfirmation(
    "Are you sure you want to reload? You might lose your progress."
  );

  // Extract data from the selected assessment
  useEffect(() => {
    if (!isErrorState) {
      setAssessment(assessments[selectedAssessmentIndex]);
      const evaluationTime =
        assessments[selectedAssessmentIndex]?.evaluationCriteria
          ?.timeToComplete || 0;
      setAssessmentTime(evaluationTime); // Ensure the assessment time doesn't exceed the audio duration
      //setTotalTime(evaluationTime);
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

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };
  const handleBack = () => {
    navigate("/practice/grammer");
  };

  const handleSubmit = () => {
    // handle submit
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    console.log("Submitting answers:", answers);

    if (!answers && answers.length < 0) {
      toast.error("Answers are missing or invalid");
      return;
    }
    dispatch(
      getGrammarAssessmentAnalysis({
        answers: answers,
        assessmentID: assessment._id,
      })
    )
      .unwrap()
      .then((result) => {
        console.log(result);
        setProgress(70);
        //setAssessment(result?.assessment);
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
            <div className="mb-8 bg-white border border-gray-300 rounded-lg shadow-sm">
              <div className=" flex  justify-between items-center p-6">
                <TakeAssessmentHeader
                  title={
                    assessment?.title ||
                    `Grammer Assessment ${selectedAssessmentIndex + 1}`
                  }
                  assessment={assessment}
                />
                {assessmentTime && (
                  <TimeDisplay
                    ref={timeDisplayRef}
                    timeLeft={assessmentTime}
                    isScrolled={isScrolled}
                  />
                )}
              </div>
            </div>

            <McqBasedAssessmentUi
              assessmentName={"grammar"}
              questions={questions}
              handleSubmit={handleSubmit}
              layout={layout}
              setLayout={setLayout}
              currentQuestion={currentQuestion}
              answers={answers}
              setCurrentQuestion={setCurrentQuestion}
              isSubmitted={isSubmitted}
              handleAnswerChange={handleAnswerChange}
              answeredQuestionsCount={answeredQuestionsCount}
            />
          </>
        )}
        <div className="w-full flex justify-center">
          <button
            onClick={handleBack} // Add click handler for navigation
            className={`flex mt-8 items-center justify-center px-4 py-2 border rounded-md transition-all duration-200  text-teal-600 border-teal-600 hover:bg-teal-50 
                }`}
            disabled={isAnalyzing}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Main Page
          </button>
        </div>
      </main>
      </>
  );
}
