// src/components/AssessmentHeader.jsx

import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";

const AssessmentHeader = ({
  title,
  difficulty,
  showCompleted,
  onDifficultyChange,
  onToggleShowCompleted,
}) => {
  return (
    <div className="bg-[#09456a] p-4 rounded-lg mb-6 flex flex-col flex-wrap gap-4 w-full">
      <h1 className="text-3xl font-bold text-white text-center">{title}</h1>
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
            onChange={onDifficultyChange}
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
            onChange={onToggleShowCompleted}
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
  );
};

export default AssessmentHeader;
