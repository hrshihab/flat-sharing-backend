import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { flatService } from "./flat.service";
import pick from "../../../shared/pick";
import { flatFilterableFields } from "./flat.constant";

const addFlat = catchAsync(async (req, res) => {
  console.log(req.body, req.files);
  const userId = req.user.id;
  const payload = { ...req.body, userId };
  console.log(payload);
  const files = Array.isArray(req.files) ? req.files : [req.files]; // Ensure req.files is an array
  const result = await flatService.addFlat(files, payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Flat added successfully",
    data: result,
  });
});

const getFlats = catchAsync(async (req, res) => {
  const user = req.user as any;
  const filters = pick(req.query, flatFilterableFields);
  console.log(filters);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await flatService.getFlatsFromDB(user, filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Flats retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getFlatByUserId = catchAsync(async (req, res) => {
  const result = await flatService.getFlatByUserId(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flats Created By User fetched successfully",
    data: result,
  });
});

const getSingleFlat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await flatService.getSingleFlatFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat retrieval successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req, res) => {
  const result = await flatService.updateFlat(req.params.flatId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat Data updated successfully",
    data: result,
  });
});

const updateMyFlat = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await flatService.updateMyFlatDataIntoDB(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FLat data updated!",
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
  getFlats,
  getSingleFlat,
  updateFlat,
  updateMyFlat,
  deleteFlat,
  getFlatByUserId,
};
