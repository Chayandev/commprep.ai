import React, { Suspense, useEffect, useState } from "react";
import logo from "/ic_speaking.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGrammarAssessments,
  getAllSpeakingAssessments,
} from "../../../actions/user.actions.js";
import { selectAssessment } from "../../features/userOperationSlice.js";
import { useNavigate } from "react-router-dom";
import AssessmentHeader from "../../components/AssessmentHeader.jsx";
import NoAssessmentsFound from "../../components/NoAssessmentFound.jsx";
const AssessmentCard = React.lazy(() =>
  import("../../components/AssessmentCard.jsx")
);
import { v4 as uuidv4 } from "uuid";
import LazyLoadingCard from "../../components/LazyLoadingCard.jsx";
import LoadingUI from "../../components/LoadingUI.jsx";

export default function SpeakingAssessments() {
  const navigate = useNavigate();
  const [showCompleted, setShowCompleted] = useState(true);
  const [difficulty, setDifficulty] = useState("All");

  const handleChange = (event) => setDifficulty(event.target.value);
  const handleToggleCompleted = () => setShowCompleted(!showCompleted);

  const dispatch = useDispatch();
  const { isProcessing, assessments } = useSelector((state) => state.operation);

  const handleSelectAssessment = (index) => {
    dispatch(selectAssessment(index));
    navigate(`/practice/speaking/assessment/${index + 1}`);
  };

  useEffect(() => {
    dispatch(getAllSpeakingAssessments());
  }, [dispatch]);

  const filteredAssessments = assessments?.filter(
    (assessment) =>
      (difficulty === "All" ||
        assessment.difficulty === difficulty.toLowerCase()) &&
      (showCompleted || !assessment.isCompleted)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex flex-col items-center">
      {isProcessing ? (
        <div className="min-h-screen flex justify-center items-center">
          <LoadingUI />
        </div>
      ) : (
        <main className="w-[90%] lg:w-[80%] mx-auto py-6">
          <AssessmentHeader
            title="Speaking Assessments"
            difficulty={difficulty}
            showCompleted={showCompleted}
            onDifficultyChange={handleChange}
            onToggleShowCompleted={handleToggleCompleted}
          />

          {filteredAssessments?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment, index) => (
                <Suspense key={uuidv4()} fallback={<LazyLoadingCard />}>
                  <AssessmentCard
                    key={assessment._id} // Add a unique key here
                    assessment={assessment}
                    index={index}
                    handleSelectAssessment={handleSelectAssessment}
                    logo={logo}
                  />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="flex justify-center mt-10">
              <NoAssessmentsFound />{" "}
              {/* Display NoAssessmentsFound in the main content area */}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
