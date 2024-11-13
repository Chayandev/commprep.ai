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
import { convertToMilliseconds } from "../utils/convertToMiliseconds.js";

// Set maxAge using the converted values
const accessTokenMaxAge = convertToMilliseconds(
  process.env.ACCESS_TOKEN_EXPIRY
);
const refreshTokenMaxAge = convertToMilliseconds(
  process.env.REFRESH_TOKEN_EXPIRY
);

//options to secure cookies
const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/", // Allow cookie across the app
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
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: accessTokenMaxAge, // Set maxAge using the environment variable
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: refreshTokenMaxAge, // Optionally set for refresh token as well
    })
    .json(new ApiResponse(200, loggedinUser, "User logged in Successfully!"));
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

//auto-login
const autoLoginUser = asyncHandler(async (req, res) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken && refreshToken) {
    console.log("generating new accesstoken using accesstoken");
    try {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decodedToken._id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token is invalid or expired.");
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);

      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      await user.save();

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(200, user, "Access token refreshed successfully!")
        );
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token or expired.");
    }
  } else {
    // Handle access token verification
    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, user, "Auto-login successful"));
    } catch (error) {
      throw new ApiError(401, "Invalid access token");
    }
  }
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
          { accessToken, refreshToken },
          "Access token Refreshed sucessfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refrech Token");
  }
});

//reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    throw new ApiError(401, "Your rechek the confirsm passwordFiled");
  }

  const user = await User.findById(userId);

  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); //as we r only chanign the password so no need to validate the other fields

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

//send verification email-with email
const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(401, "No user found with this email");
  }

  const newVerificationCode = randomCryptoVerificationCode();
  const newVerificationCodeExpiryTime = oneDayExpiryTime();

  user.set({
    verificationCode: newVerificationCode,
    verificationCodeExpireAt: newVerificationCodeExpiryTime,
  });

  await user.save();

  sendVerificationEmail(user.email, user.verificationCode);

  return res
    .status(201)
    .json(new ApiResponse(200, "Verificaion-code is sent to you email id!"));
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
  autoLoginUser,
  refreshAccessToken,
  sendVerificationCode,
  resetPassword,
};
