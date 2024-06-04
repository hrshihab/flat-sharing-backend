import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { bookingValidation } from "./booking.validation";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../User/User.constant";
const router = express.Router();
//create booking requests
router.post(
  "/booking-requests",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  bookingController.createBooking
);
//get all booking requests by Admin
router.get(
  "/get-all-requests",
  auth(USER_ROLE.ADMIN),
  bookingController.getBooking
);
//get booking requests by flat id
router.get(
  "/get-all-requests/:flatId",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  bookingController.getBookingByFlatId
);

//get booking requests by user id
router.get(
  "/get-user-booking-requests",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  bookingController.getBookingByUserId
);

//update booking status
router.put(
  "/booking-requests/:bookingId",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(bookingValidation.bookingStatusValidation),
  bookingController.updateStatus
);

export const bookingRoutes = router;
