"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatValidationSchema = void 0;
const zod_1 = require("zod");
const flatValidation = zod_1.z.object({
  body: zod_1.z.object({
    squareFeet: zod_1.z.number(),
    totalBedrooms: zod_1.z.number(),
    totalRooms: zod_1.z.number(),
    amenities: zod_1.z.string(),
    location: zod_1.z.string(),
    description: zod_1.z.string(),
    rent: zod_1.z.number(),
    advanceAmount: zod_1.z.number(),
  }),
});
const flatUpdateValidation = zod_1.z.object({
  body: zod_1.z.object({
    squareFeet: zod_1.z.number().optional(),
    totalBedrooms: zod_1.z.number().optional(),
    totalRooms: zod_1.z.number().optional(),
    amenities: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    rent: zod_1.z.number().optional(),
    advanceAmount: zod_1.z.number().optional(),
  }),
});
exports.flatValidationSchema = {
  flatValidation,
  flatUpdateValidation,
};
