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
exports.flatService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const sendImageToCloudinary_1 = require("../../../shared/sendImageToCloudinary");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const addFlat = (files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //console.log(payload);
        const imageUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const imageName = `flat-${payload.rentAmount}-${file.originalname}`;
                const path = file.path;
                const response = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
                const { secure_url } = response;
                imageUrls.push(secure_url);
            }
        }
        const result = yield prisma_1.default.flat.create({
            data: Object.assign(Object.assign({}, payload), { photos: imageUrls }),
        });
        return result;
    }
    catch (error) {
        throw new Error(error);
    }
});
const getFlatsFromDB = (user, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { location, priceMin, priceMax, bedrooms } = filters;
    //console.log(priceMax, priceMin, location, bedrooms);
    const andConditions = [];
    // Filter by location
    if (location) {
        andConditions.push({
            location: {
                contains: location,
                mode: "insensitive", // Case-insensitive search
            },
        });
    }
    // Filter by price range
    if (priceMin !== undefined || priceMax !== undefined) {
        const rentFilter = {};
        if (priceMin !== undefined) {
            rentFilter.gte = Number(priceMin);
        }
        if (priceMax !== undefined) {
            rentFilter.lte = Number(priceMax);
        }
        andConditions.push({
            rentAmount: rentFilter,
        });
    }
    // Filter by number of bedrooms
    if (bedrooms) {
        andConditions.push({
            bedrooms: Number(bedrooms),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.flat.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profilePhoto: true,
                    role: true,
                    needPasswordChange: true,
                    status: true,
                },
            },
            // See how many booikings are there for each flat
            booking: {
                select: {
                    id: true,
                },
            },
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
const getFlatByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(userId);
    const result = yield prisma_1.default.flat.findMany({
        where: {
            userId: userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profilePhoto: true,
                    role: true,
                    needPasswordChange: true,
                    status: true,
                },
            },
            // See how many booikings are there for each flat
            booking: {
                select: {
                    id: true,
                },
            },
        },
    });
    return result;
});
const getSingleFlatFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.findFirstOrThrow({
        where: {
            id,
        },
        select: {
            id: true,
            location: true,
            description: true,
            photos: true,
            rentAmount: true,
            bedrooms: true,
            amenities: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const updateFlat = (flatId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(flatId, payload);
    const result = yield prisma_1.default.flat.update({
        where: {
            id: flatId,
        },
        data: payload,
    });
    return result;
});
const updateMyFlatDataIntoDB = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flat.findFirstOrThrow({
        where: {
            id,
            userId,
        },
    });
    const result = yield prisma_1.default.flat.update({
        where: {
            id,
            userId,
        },
        data: payload,
    });
    return result;
});
const deleteFlat = (flatId) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(flatId);
    try {
        // Use a transaction to ensure atomicity
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete all associated bookings first
            yield prisma.booking.deleteMany({
                where: {
                    flatId: flatId,
                },
            });
            // Then delete the flat
            const flat = yield prisma.flat.delete({
                where: {
                    id: flatId,
                },
            });
            return flat;
        }));
        //console.log("Flat deleted successfully:", result);
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Failed to delete flat");
    }
});
exports.flatService = {
    addFlat,
    getFlatsFromDB,
    getSingleFlatFromDB,
    updateMyFlatDataIntoDB,
    updateFlat,
    deleteFlat,
    getFlatByUserId,
};
