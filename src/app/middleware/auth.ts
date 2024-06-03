import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelper } from "../../helper/jwtHelper";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import { TUserRole } from "../modules/User/User.interface";

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
