import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { USER_ROLE } from "../User/User.constant";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.loginValidation),
  AuthController.loginUser
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  AuthController.changePassword
);

router.post("/forgot-password", AuthController.forgotPassword);

router.put("/reset-password", AuthController.resetPassword);

export const authRoutes = router;
