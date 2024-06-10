"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const bookingStatusValidation = zod_1.default.object({
    body: zod_1.default.object({
        status: zod_1.default.enum(["PENDING", "APPROVED", "REJECTED"]),
    }),
});
const createBookingValidation = zod_1.default.object({
    body: zod_1.default.object({
        flatId: zod_1.default.string(),
        name: zod_1.default.string(),
        age: zod_1.default.number(),
        profession: zod_1.default.string(),
        maritalStatus: zod_1.default.enum(["SINGLE", "MARRIED", "SEPARATED"]).optional(),
        PresentAddress: zod_1.default.string(),
        phoneNo: zod_1.default.string(),
    }),
});
exports.bookingValidation = {
    bookingStatusValidation,
    createBookingValidation,
};
