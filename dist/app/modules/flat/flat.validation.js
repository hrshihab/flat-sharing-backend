"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatValidationSchema = void 0;
const zod_1 = require("zod");
const flatValidation = zod_1.z.object({
    body: zod_1.z.object({
        location: zod_1.z.string(),
        description: zod_1.z.string(),
        rentAmount: zod_1.z.number(),
        bedrooms: zod_1.z.number(),
        amenities: zod_1.z.array(zod_1.z.string()),
    }),
});
const flatUpdateValidation = zod_1.z.object({
    body: zod_1.z.object({
        location: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        rentAmount: zod_1.z.number().optional(),
        bedrooms: zod_1.z.number().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.flatValidationSchema = {
    flatValidation,
    flatUpdateValidation,
};
