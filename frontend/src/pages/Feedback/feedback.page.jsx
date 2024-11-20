import {
  Alert,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CustomTextField from "../../components/CustomTextField";
import { StarIcon } from "lucide-react";
import { EmojiEmotionsRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addUserFeedback } from "../../../actions/user.actions";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";

export default function Feedback() {
  const dispatch = useDispatch();
  const { isProcessing, message } = useSelector((state) => state.operation);
  const [progress, setProgress] = useState(0);
  const [consent, setConsent] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [rating, setRating] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    feedback: "",
    feedbacktype: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedback = {
      title: formValues.title,
      feedbackDescription: formValues.feedback,
      feedbackType: formValues.feedbacktype,
      rating: rating,
    };
    setProgress(20);
    // Dispatch the addUser feedback action on submit
    dispatch(addUserFeedback(feedback))
      .unwrap()
      .then((result) => {
        setProgress(70);
        // Clear all fields
        setFormValues({
          title: "",
          feedback: "",
          feedbacktype: "",
        });
        setRating(null); // Reset rating
        setConsent(false); // Reset consent checkbox
        setShowSnackbar(true); // Show snackbar for confirmation
      })
      .catch((error) => {
        // Show the error message as a toast error
        toast.error(error || "An error occurred during adding feedback", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error during adding feedback:", error);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <LoadingBar
        color="#02cbc3"
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <main className="w-[90%] lg:w-[80%] mx-auto py-6 items-center flex justify-center">
        <Card className="w-full max-w-3xl p-4 overflow-hidden">
          <div className="flex justify-center items-center ">
            <svg
              className="w-10 h-10 text-primary mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <Typography
              variant="h4"
              align="center"
              color="text.primary"
              style={{ fontWeight: 600 }}
            >
              Your Feedback Matters!
            </Typography>
          </div>
          <Typography align="center" color="text.secondary">
            We value every opinion, whether it's a compliment, a suggestion, or
            a concern.
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <CustomTextField
                id="title"
                label="Title"
                type="text"
                variant="outlined"
                required
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
              />
              <CustomTextField
                id="feedback"
                label="Your Feedback"
                type="text"
                multiline
                rows={4}
                variant="outlined"
                required
                name="feedback"
                value={formValues.feedback}
                onChange={handleInputChange}
              />
              {/* dropdown for types fo feedback */}
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#02cbc3", // Custom focus color
                    },
                  },
                }}
              >
                <Select
                  name="feedbacktype"
                  displayEmpty
                  labelId="feedbacktype-label"
                  id="feedbacktype"
                  value={formValues.feedbacktype}
                  onChange={handleInputChange}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem disabled value="">
                    <em className="text-gray-500">Feedback Type</em>
                  </MenuItem>
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="appreciation">Appreciation</MenuItem>
                  <MenuItem value="suggestions">Suggestions</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <div className="flex flex-col justify-center">
                <Typography
                  component="legend"
                  align="center"
                  color="#03ccc2"
                  gutterBottom
                  style={{ fontWeight: 600 }}
                >
                  Rate your overall experience
                </Typography>
                <div className="flex items-center justify-center bg-gradient-to-r from-[#03ccc2] to-[#ffc120] p-4 rounded-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      onClick={() => setRating(star)}
                      sx={{
                        color: rating >= star ? "#fd8f16" : "white", // Yellow if rated, white otherwise
                        padding: "8px",
                        transition: "transform 0.2s ease, color 0.3s ease", // Smooth transform and color transitions
                        "&:hover": {
                          transform: "scale(1.2)", // Scale up slightly on hover
                        },
                      }}
                      aria-label={`Rate ${star} stars`}
                    >
                      <StarIcon className="w-8 h-8" />
                    </IconButton>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center ">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      name="consent"
                      // required
                      className="text-[#03ccc2]"
                    />
                  }
                  label="I may be contacted about this feedback."
                  className="text-black"
                />
                <a
                  href="#"
                  className="text-primary hover:text-teal-700 font-semibold"
                >
                  Privacy Policy
                </a>
              </div>
              <button
                type="submit"
                disabled={isProcessing || !consent}
                className={`w-full py-2 rounded-md shadow-md text-white inline-flex items-center justify-center ${
                  isProcessing || !consent
                    ? "bg-teal-700 cursor-not-allowed"
                    : "bg-primary hover:bg-teal-700"
                }`}
              >
                {isProcessing && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-3 w-5 h-5 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}
                {isProcessing ? "Processing..." : "Submit Feedback"}
              </button>
            </form>
          </CardContent>
        </Card>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
            iconMapping={{
              success: <EmojiEmotionsRounded fontSize="inherit" />,
            }}
          >
            Thank you for your feedback! We'll use it to improve our services.
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
}
