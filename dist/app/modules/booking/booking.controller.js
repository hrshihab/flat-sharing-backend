"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req body:", req.body);
    console.log("req.user:", req.user);
    const payload = Object.assign(Object.assign({}, req.body), { userId: req.user.id });
    const result = yield booking_service_1.bookingService.createBooking(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Booking requests submitted successfully",
        data: result,
    });
}));
const getBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookingService.getBooking();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Booking requests retrieved successfully",
        meta: { total: result.total },
        data: result.result,
    });
}));
const getBookingByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookingService.getBookingByUserId(req.user.id);
    //console.log(req.user.id, result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single User Booking requests List retrieved successfully",
        data: result,
    });
}));
const getBookingByFlatId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const { flatId } = req.params;
    const { id, role } = req.user;
    const result = yield booking_service_1.bookingService.getBookingByFlatId(id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Booking requests by FlatId retrieved successfully",
        data: result,
    });
}));
const updateStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("come here", req.body);
    const { bookingId } = req.params;
    const { id, role } = req.user;
    const payload = req.body;
    //console.log(bookingId, payload, id, role);
    const result = yield booking_service_1.bookingService.updateStatus(bookingId, payload, id, role);
    console.log("result", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Booking requests updated successfully",
        data: result,
    });
}));
const updateStatusByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const { id, role } = req.user;
    const payload = req.body;
    const result = yield booking_service_1.bookingService.updateStatusByUser(bookingId, payload, id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Booking requests updated successfully",
        data: result,
    });
}));
exports.bookingController = {
    createBooking,
    getBooking,
    updateStatus,
    getBookingByUserId,
    getBookingByFlatId,
    updateStatusByUser,
};
