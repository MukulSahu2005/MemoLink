import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userModel } from "../models/user.model.js";
import type { CustomRequest } from "../middlewares/auth.middleware.js";

// Cookie options for secure storage
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/users/signup
 * @access  Public
 */
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new ApiError(400, "Username is required");
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }

  const orQuery: any[] = [{ username: username.toLowerCase() }];
  if (email) orQuery.push({ email: email.toLowerCase() });

  const existingUser = await userModel.findOne({ $or: orQuery });
  if (existingUser) {
    throw new ApiError(409, "User with this username or email already exists");
  }

  const user = await userModel.create({
    username: username.toLowerCase().trim(),
    email: email ? email.toLowerCase().trim() : undefined,
    password
  });

  const createdUser = await userModel.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


/**
 * @desc    Login existing user
 * @route   POST /api/v1/users/signin
 * @access  Public
 */
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new ApiError(400, "Identifier (username or email) and password are required");
  }

  const search = identifier.includes('@')
    ? { email: identifier.toLowerCase() }
    : { username: identifier.toLowerCase() };

  const user = await userModel.findOne(search);
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await userModel.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken
        },
        "User logged in successfully"
      )
    );
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/users/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
