import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function CustomTextField({ error, helperText, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : type}
      error={error}
      helperText={error ? helperText : ""}
      slotProps={{
        input: {
          endAdornment: type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        "& label.Mui-focused": {
          color: error ? "#b00000" : "#0D9488",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: error ? "#b00000" : "",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "#b00000" : "#02cbc3",
          },
        },
      }}
    />
  );
}
