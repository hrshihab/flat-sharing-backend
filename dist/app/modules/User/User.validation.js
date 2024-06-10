"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userCreateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
});
const userUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        status: zod_1.z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
        // role will be ADMIN or USER
        role: zod_1.z.enum(["ADMIN", "USER"]).optional(),
    }),
});
exports.userValidation = {
    userCreateValidationSchema,
    userUpdateValidationSchema,
};
