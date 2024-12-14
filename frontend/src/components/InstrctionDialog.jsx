import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const InstructionDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Speaking Assessment Instructions</DialogTitle>
      <DialogContent>
        <Box>
          {/* Introduction */}
          <Typography variant="subtitle1" gutterBottom>
            Welcome to the Speaking Assessment! Please follow the steps below:
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Step 1 */}
          <Typography variant="h6">1. Assessment Overview</Typography>
          <Typography variant="body1" gutterBottom>
            - You will be given a topic to speak about.
          </Typography>
          <Typography variant="body1" gutterBottom>
            - The assessment consists of three parts:
          </Typography>
          <Typography variant="body2" gutterBottom>
            &nbsp;&nbsp;&bull; <strong>Thinking Time:</strong> Time to think and
            organize your thoughts.
          </Typography>
          <Typography variant="body2" gutterBottom>
            &nbsp;&nbsp;&bull; <strong>Response Time:</strong> Time to speak on
            the topic.
          </Typography>
          <Typography variant="body2" gutterBottom>
            &nbsp;&nbsp;&bull; <strong>Result Analysis:</strong> Performance
            feedback on clarity, grammar, and relevance.
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Step 2 */}
          <Typography variant="h6">2. Key Instructions</Typography>
          <Typography variant="body1" gutterBottom>
            💡 <strong>Thinking Time:</strong> Use this time to outline your
            response.
          </Typography>
          <Typography variant="body1" gutterBottom>
            🗣️ <strong>Response Time:</strong> Focus on the topic and speak
            clearly.
          </Typography>
          <Typography variant="body1" gutterBottom>
            📊 <strong>Result Analysis:</strong> Evaluate performance on
            clarity, coherence, and relevance.
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Tips */}
          <Typography variant="h6">3. Tips for Success</Typography>
          <Typography variant="body1" gutterBottom>
            - Stay on topic and avoid going off-track.
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Use thinking time effectively to create an outline in your mind.
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Manage your response time to cover all key points without rushing.
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Time Display */}
          <Typography variant="h6">4. Time Display</Typography>
          <Typography variant="body1" gutterBottom>
            - Remaining time for both Thinking and Speaking phases will be
            displayed on the screen.
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Objective */}
          <Typography variant="h6">5. Objective</Typography>
          <Typography variant="body1" gutterBottom>
            - The goal is to assess your ability to think critically, organize
            ideas, and articulate them clearly within a limited time.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleClose}
          className="rounded-md bg-primary shadow-sm px-6 py-2 text-white"
        >
          Got It
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructionDialog;
