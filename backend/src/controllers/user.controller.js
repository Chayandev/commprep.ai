import { cloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { asyncHandelr } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

//registering user
const registerUser = asyncHandelr(async (req, res) => {
  // get user details form the frontend
  // validation
  // check user already exist or not username , email
  // create user object - create enry in db
  // erase the password field and the refresh token field from response
  // check for user creation
  // return response

  const { fullname, username, email, password, avatar, role } = req.body; // if data is somming from form or json then will find form body

  if (
    [fullname, email, username, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All mandetory fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username or emial already exist!");
  }

  const user = await User.create({
    fullname: fullname,
    username: username.toLowerCase(),
    email: email,
    avatar: avatar || "",
    password: password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while creating user please retry"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Registration Scuccessfullamr"));
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
