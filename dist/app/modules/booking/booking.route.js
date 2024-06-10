"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const booking_validation_1 = require("./booking.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const User_constant_1 = require("../User/User.constant");
const router = express_1.default.Router();
//create booking requests
router.post("/booking-requests", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(booking_validation_1.bookingValidation.createBookingValidation), booking_controller_1.bookingController.createBooking);
//get all booking requests by Admin
router.get("/get-all-requests", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), booking_controller_1.bookingController.getBooking);
//get booking requests by flat id
router.get("/get-all-requests-user", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), booking_controller_1.bookingController.getBookingByFlatId);
//get booking requests by user id
router.get("/get-user-booking-requests", (0, auth_1.default)(User_constant_1.USER_ROLE.USER, User_constant_1.USER_ROLE.ADMIN), booking_controller_1.bookingController.getBookingByUserId);
//update booking status by admin
router.put("/booking-requests/:bookingId", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(booking_validation_1.bookingValidation.bookingStatusValidation), booking_controller_1.bookingController.updateStatus);
//update booking status by user
router.put("user/booking-requests/:bookingId", (0, auth_1.default)(User_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(booking_validation_1.bookingValidation.bookingStatusValidation), booking_controller_1.bookingController.updateStatusByUser);
exports.bookingRoutes = router;
