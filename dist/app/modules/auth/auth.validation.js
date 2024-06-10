"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().optional(),
        username: zod_1.z.string().optional(),
        password: zod_1.z.string(),
    }),
});
exports.authValidation = {
    loginValidation,
};
