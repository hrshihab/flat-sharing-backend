import express, { NextFunction, Request, Response } from "express";
import { flatController } from "./flat.controller";
import validateRequest from "../../middleware/validateRequest";
import { flatValidationSchema } from "./flat.validation";
import auth from "../../middleware/auth";
import { upload } from "../../../shared/sendImageToCloudinary";
import { USER_ROLE } from "../User/User.constant";

const router = express.Router();

router.post(
  "/create-flat",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  (req: Request, res: Response, next: NextFunction) => {
    //console.log(req.body, req.files); // Log the body
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      //console.log("files:", req.files); // Log the files
      //console.log("req.body before parsing:", req.body); // Log the body before parsing

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
  validateRequest(flatValidationSchema.flatValidation),
  flatController.addFlat
);

router.get(
  "/get-all-flats",
  //auth(USER_ROLE.ADMIN),
  flatController.getFlats
);

router.get(
  "/get-my-flats",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  flatController.getFlatByUserId
);

router.get(
  "/getSingleFlat/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  flatController.getSingleFlat
);

router.patch(
  "/updateFLat/:flatId",
  auth(USER_ROLE.ADMIN),
  flatController.updateFlat
);

router.patch(
  "/updateMyFLat/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  flatController.updateMyFlat
);

router.delete(
  "/deleteFlat/:flatId",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  flatController.deleteFlat
);

export const FLatRoutes = router;
