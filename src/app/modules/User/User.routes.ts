import express, { NextFunction, Request, Response } from "express";
import { userController } from "./User.controller";
import { userValidation } from "./User.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./User.constant";
import { upload } from "../../../shared/sendImageToCloudinary";

const router = express.Router();
//console.log("Done");

router.post(
  "/register",
  validateRequest(userValidation.userCreateValidationSchema),
  userController.createUser
);

router.get(
  "/me",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  userController.getUserProfile
);

router.patch(
  "/editprofile",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  // (req: Request, res: Response, next: NextFunction) => {
  //   upload(req, res, function (err) {
  //     if (err) {
  //       return res.status(400).json({ message: err.message });
  //     }
  //     //console.log("files:", req.files); // Log the files
  //     console.log("req.body before parsing:", req.body); // Log the body before parsing

  //     try {
  //       if (req.body.data) {
  //         // Check if req.body.data is a string and parse it
  //         //console.log("req.body.data before parsing:", req.body.data);
  //         req.body = JSON.parse(req.body.data);
  //         //console.log("req.body after parsing:", req.body);
  //       }
  //       next();
  //     } catch (error: any) {
  //       console.error("JSON parsing error:", error.message);
  //       return res.status(400).json({
  //         message: "Invalid JSON in request body",
  //         error: error.message,
  //       });
  //     }
  //   });
  // },
  validateRequest(userValidation.userProfileUpdateValidationSchema),
  userController.updateUserProfile
);
router.patch(
  "/editstatus",
  auth(USER_ROLE.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      //console.log("files:", req.files); // Log the files
      console.log("req.body before parsing:", req.body); // Log the body before parsing

      try {
        if (req.body.data) {
          // Check if req.body.data is a string and parse it
          //console.log("req.body.data before parsing:", req.body.data);
          req.body = JSON.parse(req.body.data);
          //console.log("req.body after parsing:", req.body);
        }
        next();
      } catch (error: any) {
        console.error("JSON parsing error:", error.message);
        return res.status(400).json({
          message: "Invalid JSON in request body",
          error: error.message,
        });
      }
    });
  },
  validateRequest(userValidation.userUpdateValidationSchema),
  userController.updateUserStatus
);
router.get("/all-user", auth(USER_ROLE.ADMIN), userController.getAllUser);
export const userRoutes = router;
