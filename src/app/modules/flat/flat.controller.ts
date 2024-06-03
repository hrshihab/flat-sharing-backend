import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { flatService } from "./flat.service";
import pick from "../../../shared/pick";
import { FilterableFlatFields } from "./flat.constant";

const addFlat = catchAsync(async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [req.files]; // Ensure req.files is an array
  const result = await flatService.addFlat(files, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Flat added successfully",
    data: result,
  });
});

const getAllFlats = catchAsync(async (req, res) => {
  //console.log(req.query); ////{ searchTerm: 'water' }
  const filter = await pick(req.query, FilterableFlatFields);
  const options = await pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  //console.log("Options", options);

  const result = await flatService.getAllFlats(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All flats fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getFlatByUserId = catchAsync(async (req, res) => {
  const result = await flatService.getFlatByUserId(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat fetched successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req, res) => {
  const result = await flatService.updateFlat(req.params.flatId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat updated successfully",
    data: result,
  });
});

const deleteFlat = catchAsync(async (req, res) => {
  const result = await flatService.deleteFlat(req.params.flatId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat deleted successfully",
    data: result,
  });
});

export const flatController = {
  addFlat,
  getAllFlats,
  getFlatByUserId,
  updateFlat,
  deleteFlat,
};
