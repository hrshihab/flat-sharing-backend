"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const User_constant_1 = require("../User/User.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.authValidation.loginValidation), auth_controller_1.AuthController.loginUser);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
router.post("/change-password", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), auth_controller_1.AuthController.changePassword);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.put("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.authRoutes = router;
