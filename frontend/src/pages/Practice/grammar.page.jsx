import React, { Suspense, useEffect, useState } from "react";
import logo from "/ic_grammar.png";
import { useDispatch, useSelector } from "react-redux";
import { getAllGrammarAssessments } from "../../../actions/user.actions.js";
import { selectAssessment, setDifficulty, setShowCompleted } from "../../features/userOperationSlice.js";
import { useNavigate } from "react-router-dom";
import AssessmentHeader from "../../components/AssessmentHeader.jsx";
import NoAssessmentsFound from "../../components/NoAssessmentFound.jsx";
import LoadingUI from "../../components/LoadingUI.jsx";
import LazyLoadingCard from "../../components/LazyLoadingCard.jsx";

const AssessmentCard = React.lazy(() =>
  import("../../components/AssessmentCard.jsx")
);

export default function GrammarAssessments() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (event) => dispatch(setDifficulty(event.target.value));
  const handleToggleCompleted = () => dispatch(setShowCompleted());

  const { isProcessing, filteredAssessments, showCompleted, difficulty } =
    useSelector((state) => state.operation);

  const handleSelectAssessment = (index) => {
    dispatch(selectAssessment(index));
    navigate(`/practice/grammar/assessment/${index + 1}`);
  };

  useEffect(() => {
    dispatch(getAllGrammarAssessments());
  }, []);

  return (
    <div className="flex flex-col items-center">
      {isProcessing ? (
        <div className="min-h-screen flex justify-center items-center">
          <LoadingUI />
        </div>
      ) : (
        <main className="w-[90%] lg:w-[80%] mx-auto py-6">
          <AssessmentHeader
            title="Grammar Assessments"
            difficulty={difficulty}
            showCompleted={showCompleted}
            onDifficultyChange={handleChange}
            onToggleShowCompleted={handleToggleCompleted}
          />

          {filteredAssessments?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment, index) => (
                <Suspense
                  key={assessment._id || index}
                  fallback={<LazyLoadingCard />}
                >
                  <AssessmentCard
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
