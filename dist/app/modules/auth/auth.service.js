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
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../../helper/jwtHelper");
const client_1 = require("@prisma/client");
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("loginUser", payload);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            password: true,
            needPasswordChange: true,
        },
    });
    console.log(user);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not Active or not found!");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid password");
    }
    // Generate an access token
    const data = { email: user.email, id: user.id, role: user.role };
    const secret = config_1.default.jwt.jwt_secret;
    const expiresIn = config_1.default.jwt.expires_in;
    const accessToken = yield jwtHelper_1.jwtHelper.generateToken(data, secret, expiresIn);
    //Generate a refresh token
    const refreshSecret = config_1.default.jwt.refresh_token_secret;
    const refreshExpiresIn = config_1.default.jwt.refresh_token_expires_in;
    const refreshToken = yield jwtHelper_1.jwtHelper.generateToken(data, refreshSecret, refreshExpiresIn);
    // Create a new object without the password field
    // const userWithoutPassword = {
    //   id: user.id,
    //   name: user.username,
    //   email: user.email,
    //   role: user.role,
    //   token: accessToken,
    // };
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // Generate an access token
    const data = { email: user.email, id: user.id, role: user.role };
    const secret = config_1.default.jwt.jwt_secret;
    const expiresIn = config_1.default.jwt.expires_in;
    const accessToken = yield jwtHelper_1.jwtHelper.generateToken(data, secret, expiresIn);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const data = { email: user.email, id: user.id, role: user.role };
    const resetPassToken = jwtHelper_1.jwtHelper.generateToken(data, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${user.id}&token=${resetPassToken}`;
    const result = yield (0, emailSender_1.default)(user.email, `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                    <h3>Link will expired after 15 minutes!!</h3>
                </a>
            </p>

        </div>
        `);
    return result;
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const isValidToken = jwtHelper_1.jwtHelper.verifyToken(payload.token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bcrypt_1.default.hash(payload.password, 10);
    // update into database
    const resutl = yield prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
    return resutl;
});
exports.authService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
