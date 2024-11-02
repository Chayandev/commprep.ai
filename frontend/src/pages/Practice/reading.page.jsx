import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import logo from "/ic_reading.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getAllReadingAssesments } from "../../../actions/user.actions";
import {
  moveNextAssessment,
  selectAssessment,
} from "../../features/userOperationSlice";
import { useNavigate } from "react-router-dom";

export default function ReadingAssessments() {
  const navigate = useNavigate();
  const [showCompleted, setShowCompleted] = useState(true);
  const [difficulty, setDifficulty] = useState("All");

  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };

  const dispatch = useDispatch();
  const { isProcessing, assessments } = useSelector((state) => state.operation);

  const handleSelectAssessment = (index) => {
    dispatch(selectAssessment(index));
    navigate(`/practice/reading/assessment/${index + 1}`);
  };

  // useEffect(() => {
  //   navigate(`/practice/reading/assessment/${selectedAssessmentIndex}`);
  // }, [handleSelectAssessment]);

  useEffect(() => {
    dispatch(getAllReadingAssesments());
  }, [dispatch]);

  const difficultyColor = {
    easy: "bg-[#aada27]",
    medium: "bg-[#fdc324]",
    hard: "bg-[#fc900c]",
  };

  const filteredAssessments = assessments?.filter(
    (assessment) =>
      (difficulty === "All" ||
        assessment.difficulty === difficulty.toLowerCase()) &&
      (showCompleted || !assessment.isCompleted)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      
      {isProcessing ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      ) : (
        <main className="w-[90%] lg:w-[80%] mx-auto py-6">
          <div className="bg-[#09456a] p-4 rounded-lg mb-6 flex flex-col flex-wrap gap-4 w-full">
            <h1 className="text-3xl font-bold text-white text-center">
              Reading Assessments
            </h1>
            <div className="flex flex-wrap justify-between">
              <FormControl
                sx={{
                  width: "220px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#02cbc3",
                    },
                  },
                }}
              >
                <Select
                  value={difficulty}
                  onChange={handleChange}
                  displayEmpty
                  className="w-full bg-white text-gray-700"
                >
                  <MenuItem value="All">All Difficulties</MenuItem>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-completed"
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                  sx={{
                    padding: 0.8,
                    "& .MuiSwitch-switchBase": {
                      padding: 1.1,
                      "&.Mui-checked": {
                        color: "#02cbc3",
                        "& + .MuiSwitch-track": {
                          backgroundColor: "#02cbc3",
                        },
                      },
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#ccc",
                    },
                  }}
                />
                <label htmlFor="show-completed" className="text-white">
                  Show Completed
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments?.map((assessment, index) => (
              <Card
                key={assessment._id}
                className="relative bg-white py-4 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <span
                  className={`absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-lg text-white ${
                    difficultyColor[assessment.difficulty]
                  }`}
                >
                  {assessment.difficulty.charAt(0).toUpperCase() +
                    assessment.difficulty.slice(1)}
                </span>
                {assessment.isCompleted && (
                  <div
                    className="absolute top-12 left-[-25px] rotate-[-45deg] bg-[#046f45] text-white text-xs text-center py-1 px-6"
                    style={{ transformOrigin: "left top" }}
                  >
                    Completed
                  </div>
                )}
                <CardHeader
                  className="pb-0"
                  title={
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 600 }}
                      className="text-[#09456a]"
                    >
                      {`Assessment ${index + 1}`}
                    </Typography>
                  }
                />
                <CardContent className="pt-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      width={300}
                      height={80}
                      className="h-20 w-auto bg-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-center text-sm text-[#046f45] mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Approx. {assessment.evaluationCriteria.timeToComplete}{" "}
                      Seconds
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelectAssessment(index)}
                    className="w-full mt-4 transition-all py-2 rounded-md duration-300 hover:scale-105 bg-[#03ccc2] hover:bg-[#02a39a] text-white"
                  >
                    {assessment.isCompleted
                      ? "Retake Assessment"
                      : "Start Assessment"}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
