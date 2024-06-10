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
exports.flatController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const flat_service_1 = require("./flat.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const flat_constant_1 = require("./flat.constant");
const addFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.body, req.files);
    const userId = req.user.id;
    const payload = Object.assign(Object.assign({}, req.body), { userId });
    //console.log(payload);
    const files = Array.isArray(req.files) ? req.files : [req.files]; // Ensure req.files is an array
    const result = yield flat_service_1.flatService.addFlat(files, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Flat added successfully",
        data: result,
    });
}));
const getFlats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    //console.log("hitted");
    const filters = (0, pick_1.default)(req.query, flat_constant_1.flatFilterableFields);
    //console.log(filters);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield flat_service_1.flatService.getFlatsFromDB(user, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Flats retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getFlatByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flat_service_1.flatService.getFlatByUserId(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flats Created By User fetched successfully",
        data: result,
    });
}));
const getSingleFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield flat_service_1.flatService.getSingleFlatFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flat retrieval successfully",
        data: result,
    });
}));
const updateFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flat_service_1.flatService.updateFlat(req.params.flatId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flat Data updated successfully",
        data: result,
    });
}));
const updateMyFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield flat_service_1.flatService.updateMyFlatDataIntoDB(id, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "FLat data updated!",
        data: result,
    });
}));
const deleteFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.flatId, "final out");
    const result = yield flat_service_1.flatService.deleteFlat(req.params.flatId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flat deleted successfully",
        data: result,
    });
}));
exports.flatController = {
    addFlat,
    getFlats,
    getSingleFlat,
    updateFlat,
    updateMyFlat,
    deleteFlat,
    getFlatByUserId,
};
