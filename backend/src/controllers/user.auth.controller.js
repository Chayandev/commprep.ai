import { cloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { asyncHandelr as asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail } from "../nodemailer/emails.js";
import {
  oneDayExpiryTime,
  randomCryptoVerificationCode,
} from "../utils/codeGenarator.js";
import jwt from "jsonwebtoken";

//options to secure cookies
const options = {
  httpOnly: true,
  secure: true,
};
//generate access and refresh token method
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw new ApiError(500);
  }
};

//registering user
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, avatar, role } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All mandatory fields are required!");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    console.log(existedUser);

    if (existedUser.isVerified) {
      throw new ApiError(409, "User with username or email already exists!");
    }

    // If the user exists but is not verified, resend the verification email
    const newVerificationCode = randomCryptoVerificationCode();
    const newVerificationCodeExpiryTime = oneDayExpiryTime();

    existedUser.set({
      verificationCode: newVerificationCode,
      verificationCodeExpireAt: newVerificationCodeExpiryTime,
    });

    await existedUser.save(); // Save the new token

    // Resend verification email
    await sendVerificationEmail(existedUser.email, newVerificationCode);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Account exists but not verified. A new verification email has been sent."
        )
      );
  }

  const user = await User.create({
    fullname: fullname,
    username: username.toLowerCase(),
    email: email,
    avatar: avatar || "",
    password: password,
    role: role || "",
    verificationCode: randomCryptoVerificationCode(),
    verificationCodeExpireAt: oneDayExpiryTime(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log(createdUser);
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while creating user. Please retry."
    );
  }

  // Send verification email and await response
  await sendVerificationEmail(user.email, user.verificationCode);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        null,
        "Registration successful. Please check your email for verification code."
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required!");
  }

  if (!password) {
    throw new ApiError(400, "password is required!");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User dose'nt exist");
  }

  console.log(user);
  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(401, "Invalid Password");
  }

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully!"
      )
    );
});

//log out
const logoutUser = asyncHandler(async (req, res) => {
  // Use $unset to remove the refreshToken field
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: "" },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out Successfully"));
});

//refhres the accesstoken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access!");
  }

  try {
    const decodedToke = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToke?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token Refreshed sucessfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refrech Token");
  }
});

//verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationCode } = req.body;

  const user = await User.findOne({
    verificationCode: verificationCode,
    verificationCodeExpireAt: { $gt: Date.now() },
  });

  if (!user) {
    console.log(verificationCode);
    throw new ApiError(400, "Invalid or Expired Varification Code");
  }

  user.set({
    isVerified: true,
    verificationCode: undefined,
    verificationCodeExpireAt: undefined,
  });
  await user.save();

  // Create a response object excluding sensitive fields
  const { password, refreshToken, ...userResponse } = user.toObject(); // or just use user if it's a plain object
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        userResponse,
        "Email Verification is Sucessfull, you can proceed to Login!"
      )
    );
});

//fethcing avaters details form the cloudinery
const getAvatars = asyncHandler(async (req, res) => {
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

export {
  registerUser,
  loginUser,
  getAvatars,
  verifyEmail,
  logoutUser,
  refreshAccessToken,
};
