import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import type { IUser } from "../models/user.model.js";
import type { Request } from "express";

export interface CustomRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  _id: string;
  username: string;
}

export const verifyJWT = asyncHandler(async (req: CustomRequest, _, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
  
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT secret is not configured");
    }
  
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  
    const user = await userModel.findById(decodedToken._id).select("-password");
  
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
  
    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
