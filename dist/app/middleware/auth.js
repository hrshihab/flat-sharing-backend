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
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelper_1 = require("../../helper/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You're not is authorized 1");
            }
            const verifiedUser = yield jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            const { role } = verifiedUser;
            //fetch user from db and check if user is active
            const user = yield prisma_1.default.user.findUnique({
                where: { id: verifiedUser.id },
            });
            if (!user || user.status !== "ACTIVE") {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Your account is not active");
            }
            //console.log(verifiedUser, requiredRoles);
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You're not is authorized 2");
            }
            req.user = verifiedUser;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = auth;
