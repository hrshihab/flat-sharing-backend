import { Request, Response } from "express";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./User.service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  //console.log("req body:", req.body);

  const result = await userService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await userService.getUserProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Data retrieved successfully",
    data: result,
  });
});
const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  console.log(req.files);
  console.log(req.body);
  const userId = req.user.id;
  const result = await userService.updateUserProfile(
    userId,
    req.files,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully",
    meta: { total: result.length },
    data: result,
  });
});

export const userController = {
  createUser,
  getUserProfile,
  updateUserProfile,
  getAllUser,
};
