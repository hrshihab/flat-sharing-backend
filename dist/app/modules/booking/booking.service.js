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
exports.bookingService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const booking_constant_1 = require("./booking.constant");
const createBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.create({
        data: Object.assign(Object.assign({}, payload), { status: booking_constant_1.Status.PENDING }),
    });
    return result;
});
// get all flat booking request for admin
const getBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findMany();
    const total = yield prisma_1.default.booking.count();
    return {
        total,
        result,
    };
});
// how many flat booking request by userId
const getBookingByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findMany({
        where: {
            userId: userId,
        },
    });
    return result;
});
// get all booking request by flatId
const getBookingByFlatId = (userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the flats owned by the user and include bookings
    const flats = yield prisma_1.default.flat.findMany({
        where: {
            userId: userId,
        },
        include: {
            booking: true,
        },
    });
    //console.log(flats, "flats");
    if (!flats.length) {
        throw new Error("No flats found for the given user");
    }
    // Combine bookings from all flats into a single array
    const bookings = flats.flatMap((flat) => flat.booking);
    //console.log(bookings, "bookings");
    //If the user is not the owner of the flat and not an admin, deny access
    if (userRole !== "ADMIN") {
        const isOwner = flats.some((flat) => flat.userId === userId);
        if (!isOwner) {
            throw new Error("Access denied");
        }
    }
    return bookings;
});
// Update booking Status
const updateStatus = (bookingId, payload, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = payload;
    // Fetch the booking details to verify ownership
    const booking = yield prisma_1.default.booking.findUnique({
        where: {
            id: bookingId,
        },
        select: {
            flat: {
                select: {
                    userId: true, // Fetch the userId of the creator of the flat
                },
            },
        },
    });
    //  // console.log(
    //     "userId",
    //     userId,
    //     "bookingId",
    //     bookingId,
    //     "userRole",
    //     userRole,
    //     "status",
    //     status
    //   );
    if (!booking) {
        throw new Error("Booking not found");
    }
    // console.log(booking.flat.userId !== userId && userRole !== "ADMIN");
    // Check if the user is the creator of the flat or an admin
    if (booking.flat.userId !== userId && userRole !== "ADMIN") {
        throw new Error("Access denied");
    }
    // Update the booking status if access is granted
    const result = yield prisma_1.default.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: status,
        },
    });
    return result;
});
const updateStatusByUser = (bookingId, payload, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = payload;
    // Fetch the booking details to verify ownership
    const flat = yield prisma_1.default.flat.findMany({
        where: {
            userId: userId,
        },
        include: {
            booking: true,
        },
    });
    // console.log(
    //   "userId",
    //   userId,
    //   "bookingId",
    //   bookingId,
    //   "userRole",
    //   userRole,
    //   "status",
    //   status
    // );
    if (!flat) {
        throw new Error("Booking not found");
    }
    //console.log(flat);
    // Check if the user is the creator of the flat or an admin
    // if (booking.flat.userId !== userId && userRole !== "ADMIN") {
    //   throw new Error("Access denied");
    // }
    // Update the booking status if access is granted
    // const result = await prisma.booking.update({
    //   where: {
    //     id: bookingId,
    //   },
    //   data: {
    //     status: status,
    //   },
    // });
    // return result;
});
exports.bookingService = {
    createBooking,
    getBooking,
    updateStatus,
    getBookingByUserId,
    getBookingByFlatId,
    updateStatusByUser,
};
