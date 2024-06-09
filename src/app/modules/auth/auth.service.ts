import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../../config";
import { generateToken, jwtHelper } from "../../../helper/jwtHelper";
import { UserStatus } from "@prisma/client";
import emailSender from "./emailSender";

const loginUser = async (payload: {
  email?: string;
  username?: string;
  password: string;
}) => {
  //console.log("loginUser", payload);
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }, { username: payload.username }],
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      password: true,
      needPasswordChange: true,
    },
  });
  //console.log(user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Active or not found!");
  }
  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  // Generate an access token
  const data = { email: user.email, id: user.id, role: user.role };
  const secret = config.jwt.jwt_secret as string;
  const expiresIn = config.jwt.expires_in as string;
  const accessToken = await jwtHelper.generateToken(data, secret, expiresIn);

  //Generate a refresh token
  const refreshSecret = config.jwt.refresh_token_secret as string;
  const refreshExpiresIn = config.jwt.refresh_token_expires_in as string;
  const refreshToken = await jwtHelper.generateToken(
    data,
    refreshSecret,
    refreshExpiresIn
  );

  // Create a new object without the password field
  // const userWithoutPassword = {
  //   id: user.id,
  //   name: user.username,
  //   email: user.email,
  //   role: user.role,
  //   token: accessToken,
  // };
  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Generate an access token
  const data = { email: user.email, id: user.id, role: user.role };
  const secret = config.jwt.jwt_secret as string;
  const expiresIn = config.jwt.expires_in as string;
  const accessToken = await jwtHelper.generateToken(data, secret, expiresIn);

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const data = { email: user.email, id: user.id, role: user.role };
  const resetPassToken = jwtHelper.generateToken(
    data,
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_token_expires_in as string
  );
  const resetPassLink =
    config.reset_pass_link + `?userId=${user.id}&token=${resetPassToken}`;

  const result = await emailSender(
    user.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                    <h3>Link will expired after 15 minutes!!</h3>
                </a>
            </p>

        </div>
        `
  );
  return result;
};

const resetPassword = async (payload: {
  id: string;
  token: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isValidToken = jwtHelper.verifyToken(
    payload.token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 10);

  // update into database
  const resutl = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
  return resutl;
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
