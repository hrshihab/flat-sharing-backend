import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  //console.log("req body:", req.body);
  //console.log("req.user:", req.user);
  const payload = {
    ...req.body,
    userId: req.user.id,
  };
  const result = await bookingService.createBooking(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking requests submitted successfully",
    data: result,
  });
});

const getBooking = catchAsync(async (req, res) => {
  const result = await bookingService.getBooking();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking requests retrieved successfully",
    data: result,
  });
});

const getBookingByUserId = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingByUserId(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single User Booking requests List retrieved successfully",
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  //console.log("come here");
  const { bookingId } = req.params;
  const payload = req.body;
  //console.log(bookingId, payload);
  const result = await bookingService.updateStatus(bookingId, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking requests updated successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getBooking,
  updateStatus,
  getBookingByUserId,
};
