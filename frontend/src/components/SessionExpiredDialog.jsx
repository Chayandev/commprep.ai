import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleResetSession } from "../features/sessionHandlerSlice.js";

const SessionExpiredDialog = () => {
  const sessionExpired = useSelector((state) => state.session.sessionExpired);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    // Close the dialog and redirect to login
    handleClose();
    navigate("/login"); // Replace '/login' with your actual login route
  };

  const handleClose = () => {
    dispatch(handleResetSession());
  };

  return (
    <Dialog open={sessionExpired} onClose={handleClose}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        Your session has expired. Please log in again to continue.
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleLoginRedirect}
          color="primary"
          variant="contained"
        >
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
