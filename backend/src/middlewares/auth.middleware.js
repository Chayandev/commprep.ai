import jwt from "jsonwebtoken";
import { asyncHandler, ApiError } from "../utils/apiHandler/exports.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //take cookie form teh browser or auth header

   // console.log(token); //print the token passed in each route, to verify

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToke = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToke?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid or expired Access Token");
    }

    req.user = user; // setting the user to the request
    next();
});

const verifyAdminRole= asyncHandler(async (req, res, next) => {
  const user = req.user;

  if(user.permitedRole !== "admin"){
    throw new ApiError(403, "Forbidden: Admins only");
  } 

  next();
});

export { verifyAdminRole };