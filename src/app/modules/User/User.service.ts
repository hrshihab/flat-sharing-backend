import { PrismaClient, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { TUser, TUserProfile } from "./User.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { sendImageToCloudinary } from "../../../shared/sendImageToCloudinary";

const prisma = new PrismaClient();

const createUser = async (payload: TUser) => {
  try {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const userData = {
      username: payload.username,
      email: payload.email,
      status: payload.status,
      password: hashedPassword,
      // Add any other fields that your User model requires
    };

    // console.log(userData);

    const result = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        username: true, // Corrected from usernamename to username
        email: true,
        profilePhoto: true,
        status: true,
        role: true,
        needPasswordChange: true,
      },
    });

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User registration failed");
  }
};

const getUserProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
  });
  return result;
};

const updateUserProfile = async (
  userId: string,
  files: any,
  payload: Partial<TUser>
) => {
  // const result = await prisma.user.update({
  //   where: { id: userId },
  //   data: payload,
  // });
  // return result;
  try {
    //console.log(payload);
    let photoUrl = "";
    if (files && files.length > 0) {
      const file = files[0];
      const imageName = `user-${file.originalname}`;
      const path = file.path;
      const response = await sendImageToCloudinary(imageName, path);
      const { secure_url } = response as { secure_url: string };
      photoUrl = secure_url;
      payload = { ...payload, profilePhoto: photoUrl };
    }
    console.log(payload);

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        ...payload,

        // Add the user property
      },
    });

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
};

//get  all user from database
const getAllUser = async () => {
  const result = await prisma.user.findMany();

  return result;
};

export const userService = {
  createUser,
  getUserProfile,
  updateUserProfile,
  getAllUser,
};
