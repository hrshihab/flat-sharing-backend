import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { bookingValidation } from "./booking.validation";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../User/User.constant";
const router = express.Router();

router.post(
  "/booking-applications",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  bookingController.createBooking
);
router.get(
  "/booking-requests",
  auth(USER_ROLE.ADMIN),
  bookingController.getBooking
);
router.get(
  "/booking-requests/user",
  auth(USER_ROLE.USER),
  bookingController.getBookingByUserId
);
router.put(
  "/booking-requests/:bookingId",
  auth(USER_ROLE.ADMIN),
  validateRequest(bookingValidation.bookingStatusValidation),
  bookingController.updateStatus
);

export const bookingRoutes = router;
