import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CustomTextField from "./CustomTextField";

export default function FormDialog({
  dialogTitle,
  dialogSubitle,
  trigger,
  onSend,
}) {
  const [formValues, setFormValues] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    setOpen(false);
  };

  const handleSend = async (e) => {
    if (onSend) {
      await onSend(formValues.email);
    }
    //setFormValues("");
    formValues.email = "";
    handleClose();
  };

  return (
    <div>
      {/* Render trigger element and attach the open handler */}
      {React.cloneElement(trigger, { onClick: handleClickOpen })}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        // PaperProps={{
        //   sx: {
        //     background: "linear-gradient(to bottom right, #cce8e4, #add8e6)", // Gradient colors from teal-50 to blue-100
        //     color: "#000000", // Text color for better visibility against light background
        //     borderRadius: "8px", // Optional: round the corners
        //   },
        // }}
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>{dialogSubitle}</DialogContentText>
          <CustomTextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            required
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            fullWidth={true} // Set to true to make full width
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#0D9488",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#add8e6",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            sx={{
              color: "#0D9488",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#add8e6",
              },
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
