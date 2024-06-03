import express, { NextFunction, Request, Response } from "express";
import { flatController } from "./flat.controller";
import validateRequest from "../../middleware/validateRequest";
import { flatValidationSchema } from "./flat.validation";
import auth from "../../middleware/auth";
import { upload } from "../../../shared/sendImageToCloudinary";
import { USER_ROLE } from "../User/User.constant";

const router = express.Router();

router.post(
  "/flats",
  auth(),
  (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      ////console.log("files:", req.files); // Log the files
      ////console.log("req.body:", req.body); // Log the body before parsing
      try {
        req.body = JSON.parse(req.body.data);
        next();
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid JSON in request body" });
      }
    });
  },
  validateRequest(flatValidationSchema.flatValidation),
  flatController.addFlat
);

router.get("/flats", auth(USER_ROLE.ADMIN), flatController.getAllFlats);
router.get("/flats/user", auth(), flatController.getFlatByUserId);

router.put(
  "/flats/:flatId",
  auth(),
  validateRequest(flatValidationSchema.flatUpdateValidation),
  flatController.updateFlat
);
router.delete(
  "/flats/:flatId",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  flatController.deleteFlat
);

export const flatRoutes = router;
