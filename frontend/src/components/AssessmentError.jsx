import React from "react";

export default function AssessmentError() {
  return (
    <div className="text-red-600 text-center">
      <h3>Error: Assessment Cancelled or Not Available</h3>
      <p>Please select a valid assessment to continue.</p>
    </div>
  );
}
