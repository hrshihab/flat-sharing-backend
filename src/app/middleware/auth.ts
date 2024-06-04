import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelper } from "../../helper/jwtHelper";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import { TUserRole } from "../modules/User/User.interface";
import prisma from "../../shared/prisma";

const auth = (...requiredRoles: TUserRole[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You're not is authorized 1"
        );
      }
      const verifiedUser = await jwtHelper.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      const { role } = verifiedUser;
      //fetch user from db and check if user is active
      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });

      if (!user || user.status !== "ACTIVE") {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Your account is not active"
        );
      }

      //console.log(verifiedUser, requiredRoles);
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You're not is authorized 2"
        );
      }
      req.user = verifiedUser as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
