"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma = new client_1.PrismaClient();
const createUser = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
      const userData = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
      };
      const userProfileData = {
        bio: payload.bio,
        profession: payload.profession,
        address: payload.address,
      };
      const result = yield prisma.$transaction((transactionClient) =>
        __awaiter(void 0, void 0, void 0, function* () {
          const createdUser = yield transactionClient.user.create({
            data: userData,
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          });
          const createUserProfile = yield transactionClient.userProfile.create({
            data: Object.assign(Object.assign({}, userProfileData), {
              user: { connect: { id: createdUser.id } },
            }),
            include: {
              user: true,
            },
          });
          return createdUser;
        })
      );
      return result;
    } catch (error) {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        "User registration failed"
      );
    }
  });
const getUserProfile = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.userProfile.findMany();
    return result;
  });
const updateUserProfile = (userId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    //console.log(userId, payload);
    const result = yield prisma.userProfile.update({
      where: { userId: userId },
      data: payload,
    });
    return result;
  });
exports.userService = {
  createUser,
  getUserProfile,
  updateUserProfile,
};
