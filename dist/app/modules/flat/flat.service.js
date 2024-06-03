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
exports.flatService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const flat_constant_1 = require("./flat.constant");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const addFlat = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.create({
      data: Object.assign(Object.assign({}, payload), { availability: true }),
    });
    return result;
  });
const getAllFlats = (params, options) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } =
      paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params;
    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        OR: flat_constant_1.searchableFlatFields.map((field) => ({
          [field]: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        })),
      });
    }
    if (options.availability) {
      andConditions.push({
        availability: options.availability === "true",
      });
    }
    //console.log("andConditions", andConditions);
    const whereConditions =
      andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.flat.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.flat.count({
      where: whereConditions,
    });
    return {
      meta: {
        total,
        page,
        limit,
      },
      data: result,
    };
  });
const updateFlat = (flatId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.update({
      where: {
        id: flatId,
      },
      data: Object.assign({}, payload),
    });
    return result;
  });
exports.flatService = {
  addFlat,
  getAllFlats,
  updateFlat,
};
