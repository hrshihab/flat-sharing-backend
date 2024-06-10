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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const sendImageToCloudinary_1 = require("../../../shared/sendImageToCloudinary");
const prisma = new client_1.PrismaClient();
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
        const userData = {
            username: payload.username,
            email: payload.email,
            status: payload.status,
            password: hashedPassword,
            // Add any other fields that your User model requires
        };
        // console.log(userData);
        const result = yield prisma.user.create({
            data: userData,
            select: {
                id: true,
                username: true, // Corrected from usernamename to username
                email: true,
                profilePhoto: true,
                status: true,
                role: true,
                needPasswordChange: true,
            },
        });
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User registration failed");
    }
});
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findUnique({
        where: { id: userId },
    });
    return result;
});
const updateUserStatus = (userId, files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await prisma.user.update({
    //   where: { id: userId },
    //   data: payload,
    // });
    // return result;
    try {
        console.log(payload);
        let photoUrl = "";
        if (files && files.length > 0) {
            const file = files[0];
            const imageName = `user-${file.originalname}`;
            const path = file.path;
            const response = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            const { secure_url } = response;
            photoUrl = secure_url;
            payload = Object.assign(Object.assign({}, payload), { profilePhoto: photoUrl });
        }
        console.log(payload);
        const result = yield prisma.user.update({
            where: { id: userId },
            data: payload,
        });
        return result;
    }
    catch (error) {
        throw new Error(error);
    }
});
const updateUserProfile = (userId, files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await prisma.user.update({
    //   where: { id: userId },
    //   data: payload,
    // });
    // return result;
    try {
        console.log(payload);
        let photoUrl = "";
        if (files && files.length > 0) {
            const file = files[0];
            const imageName = `user-${file.originalname}`;
            const path = file.path;
            const response = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            const { secure_url } = response;
            photoUrl = secure_url;
            payload = Object.assign(Object.assign({}, payload), { profilePhoto: photoUrl });
        }
        console.log(payload);
        const result = yield prisma.user.update({
            where: { id: userId },
            data: payload,
        });
        return result;
    }
    catch (error) {
        throw new Error(error);
    }
});
//get  all user from database
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findMany();
    return result;
});
exports.userService = {
    createUser,
    getUserProfile,
    updateUserProfile,
    updateUserStatus,
    getAllUser,
};
