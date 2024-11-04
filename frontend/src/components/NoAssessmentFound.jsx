import React from "react";
import { Typography, Box } from "@mui/material"; // Import only what you need from MUI
import { BookX } from "lucide-react";

export default function NoAssessmentsFound() {
  return (
    <div className="backdrop-blur-lg bg-white bg-opacity-10 border border-slate-500 border-opacity-20 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 w-1/2">
      <Box className="mb-4">
        <BookX className="w-16 h-16 text-pink-300" />
      </Box>
      <Typography variant="h5" className="text-[#02cbc3]" gutterBottom>
        No Assessments Found
      </Typography>
      <Typography variant="body1" className="text-gray-800" gutterBottom>
        It seems there are no assessments matching your criteria. Try
        adjusting your filters or check back later for new additions.
      </Typography>
    </div>
  );
}
