import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { CheckCircle, Clock } from "lucide-react";

const AssessmentCard = ({
  assessment,
  index,
  handleSelectAssessment,
  logo,
}) => {
  const difficultyColor = {
    easy: "bg-[#aada27]",
    medium: "bg-[#fdc324]",
    hard: "bg-[#fc900c]",
  };

  return (
    <Card
      sx={{
        backgroundColor: assessment.isCompleted ? "grey.200" : "common.white",
        py: 2,
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
          transform: "scale(1.05)",
        },
      }}
      className={`relative ${
        assessment.isCompleted ? "bg-gray-50" : "bg-white"
      } py-4 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105`}
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
          className={`absolute top-12 left-[-25px] rotate-[-45deg] text-center py-1 px-8 ${
            parseFloat(assessment.score * 10) < 60
              ? "bg-red-600"
              : parseFloat(assessment.score * 10) < 80
              ? "bg-yellow-600"
              : "bg-green-600"
          } shadow-md`}
          style={{ transformOrigin: "left top" }}
        >
          <p className="text-center text-white text-xs font-semibold">
            {assessment.score * 10}/100
          </p>
        </div>
      )}

      {assessment.isCompleted && (
        <div
          className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 bg-[#046f45]/95 text-white text-xs text-center py-1.5 shadow-md"
          style={{ transformOrigin: "center center", zIndex: 10 }}
        >
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            <div>Completed at</div>
          </div>
          <div>
            {new Date(assessment.completedAt).toLocaleDateString()}{" "}
            {new Date(assessment.completedAt).toLocaleTimeString()}
          </div>
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
            Approx. {formatTime(assessment.evaluationCriteria.timeToComplete)}
          </span>
        </div>
        <button
          onClick={() => handleSelectAssessment(index)}
          className="w-full mt-4 transition-all py-2 rounded-md duration-300 hover:scale-105 bg-[#03ccc2] hover:bg-[#02a39a] text-white"
        >
          {assessment.isCompleted ? "Retake Assessment" : "Start Assessment"}
        </button>
      </CardContent>
    </Card>
  );
};

const formatTime = (time) => {
  let result = Number(time);
  if (result < 60) return `${time} seconds`;
  result = (result / 60).toFixed(2);
  const finalResult = parseFloat(result);
  return finalResult > 1 ? `${finalResult} minutes` : `${finalResult} minute`;
};

export default AssessmentCard;
