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
exports.userController = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const User_service_1 = require("./User.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("req body:", req.body);
    const result = yield User_service_1.userService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
}));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield User_service_1.userService.getUserProfile(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Data retrieved successfully",
        data: result,
    });
}));
const updateUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.files);
    console.log(req.body);
    const userId = req.body.id;
    const result = yield User_service_1.userService.updateUserProfile(userId, req.files, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
}));
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.files);
    console.log(req.body);
    const userId = req.user.id;
    const result = yield User_service_1.userService.updateUserProfile(userId, req.files, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All users retrieved successfully",
        meta: { total: result.length },
        data: result,
    });
}));
exports.userController = {
    createUser,
    getUserProfile,
    updateUserProfile,
    updateUserStatus,
    getAllUser,
};
