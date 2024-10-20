import { cloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResonse.js";
import { asyncHandelr } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail } from "../nodemailer/emails.js";
import {
  oneDayExpiryTime,
  randomCryptoVerificationCode,
} from "../utils/codeGenarator.js";

//registering user
const registerUser = asyncHandelr(async (req, res) => {
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

const loginUser = asyncHandelr(async (req, res) => {});

//verify email
const verifyEmail = asyncHandelr(async (req, res) => {
  const { verificationCode } = req.body;

  const user = await User.findOne({
    verificationCode: verificationCode,
    verificationCodeExpireAt: { $gt: Date.now() },
  });

  if (!user) {
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

export { registerUser, loginUser, getAvatars, verifyEmail };
