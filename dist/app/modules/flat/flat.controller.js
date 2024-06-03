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
exports.flatController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const flat_service_1 = require("./flat.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const flat_constant_1 = require("./flat.constant");
const addFlat = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    //console.log("req body:", req.body);
    const result = yield flat_service_1.flatService.addFlat(req.body);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.CREATED,
      success: true,
      message: "Flat added successfully",
      data: result,
    });
  })
);
const getAllFlats = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.query); ////{ searchTerm: 'water' }
    const filter = yield (0, pick_1.default)(
      req.query,
      flat_constant_1.FilterableFlatFields
    );
    const options = yield (0, pick_1.default)(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
      "availability",
    ]);
    //console.log("Options", options);
    const result = yield flat_service_1.flatService.getAllFlats(
      filter,
      options
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "All flats fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  })
);
const updateFlat = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flat_service_1.flatService.updateFlat(
      req.params.flatId,
      req.body
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Flat updated successfully",
      data: result,
    });
  })
);
exports.flatController = {
  addFlat,
  getAllFlats,
  updateFlat,
};
