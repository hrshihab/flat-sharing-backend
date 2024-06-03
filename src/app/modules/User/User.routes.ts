import express from "express";
import { userController } from "./User.controller";
import { userValidation } from "./User.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";

const router = express.Router();
//console.log("Done");

router.post(
  "/register",
  validateRequest(userValidation.userCreateValidationSchema),
  userController.createUser
);

router.get("/profile", auth(), userController.getUserProfile);
router.put(
  "/profile",
  auth(),
  validateRequest(userValidation.userUpdateValidationSchema),
  userController.updateUserProfile
);
export const userRoutes = router;
