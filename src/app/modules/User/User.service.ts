import { PrismaClient, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { TUser, TUserProfile } from "./User.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

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

    console.log(userData);

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

const updateUserProfile = async (userId: string, payload: Partial<TUser>) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
  return result;
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
