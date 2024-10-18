import { cloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { asyncHandelr } from "../utils/asyncHandler.js";

//registering user
const registerUser = asyncHandelr(async (req, res) => {
  res.status(200).json({
    message: "Ok",
  });
});

//fethcing avaters details form the cloudinery
const getAvatars = asyncHandelr(async (req, res) => {
  // Fetch all images from the 'commprep.ai_avatars' folder
  const { resources } = await cloudinary.search
    .expression("folder:commprep.ai_avatars") // Specify the folder
    .max_results(20) // You can adjust the number of results if needed
    .execute();

  if (!resources) {
    throw new ApiError(401, "No avaters found!");
  }

  console.log(resources.length);

  // Map through the resources to extract necessary fields
  const avatars = resources.map((file) => ({
    public_id: file.public_id, // Unique ID for the image
    url: file.secure_url, // Secure URL to the image
    format: file.format, // Image format (e.g., jpg, png)
  }));

  return res
    .status(201)
    .json(new ApiResponse(200, avatars, "avaters fetched sucessfully!"));
});

export { registerUser, getAvatars };
