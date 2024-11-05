import React, { useEffect, useState } from "react";
import logo from "/ic_reading.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllListeningAssessments,
  getAllReadingAssessments,
} from "../../../actions/user.actions";
import { selectAssessment } from "../../features/userOperationSlice";
import { useNavigate } from "react-router-dom";
import AssessmentHeader from "../../components/AssessmentHeader.jsx";
import AssessmentCard from "../../components/AssessmentCard.jsx";
import NoAssessmentsFound from "../../components/NoAssessmentFound.jsx";

export default function ListeningAssessments() {
  const navigate = useNavigate();
  const [showCompleted, setShowCompleted] = useState(true);
  const [difficulty, setDifficulty] = useState("All");

  const handleChange = (event) => setDifficulty(event.target.value);
  const handleToggleCompleted = () => setShowCompleted(!showCompleted);

  const dispatch = useDispatch();
  const { isProcessing, assessments } = useSelector((state) => state.operation);

  const handleSelectAssessment = (index) => {
    // dispatch(selectAssessment(index));
    // navigate(`/practice/reading/assessment/${index + 1}`);
  };

  useEffect(() => {
    dispatch(getAllListeningAssessments());
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
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      ) : (
        <main className="w-[90%] lg:w-[80%] mx-auto py-6">
          <AssessmentHeader
            title="Listening Assessments"
            difficulty={difficulty}
            showCompleted={showCompleted}
            onDifficultyChange={handleChange}
            onToggleShowCompleted={handleToggleCompleted}
          />

          {filteredAssessments?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment, index) => (
                <AssessmentCard
                  key={assessment._id} // Add a unique key here
                  assessment={assessment}
                  index={index}
                  handleSelectAssessment={handleSelectAssessment}
                  logo={logo}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center mt-10">
              <NoAssessmentsFound /> {/* Display NoAssessmentsFound in the main content area */}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
