import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TFlat } from "./flat.interface";
import { searchableFlatFields } from "./flat.constant";
import { IOptions, paginationHelper } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { sendImageToCloudinary } from "../../../shared/sendImageToCloudinary";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const addFlat = async (files: any[], payload: TFlat) => {
  try {
    const imageUrls = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const imageName = `flat-${payload.rent}-${file.originalname}`;
        const path = file.path;
        const response = await sendImageToCloudinary(imageName, path);
        const { secure_url } = response as { secure_url: string };
        imageUrls.push(secure_url);
      }
    }

    const result = await prisma.flat.create({
      data: {
        ...payload,
        photos: imageUrls,
      },
    });

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
};

const getAllFlats = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, minPrice, maxPrice, totalBedrooms } = params;
  const andConditions: Prisma.FlatWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      location: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (minPrice) {
    andConditions.push({
      rent: {
        gte: Number(minPrice),
      },
    });
  }

  if (maxPrice) {
    andConditions.push({
      rent: {
        lte: Number(maxPrice),
      },
    });
  }

  if (totalBedrooms) {
    andConditions.push({
      totalBedrooms: Number(totalBedrooms),
    });
  }

  const whereConditions: Prisma.FlatWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flat.findMany({
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

  const total = await prisma.flat.count({
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
};

const getFlatByUserId = async (userId: string) => {
  const result = await prisma.flat.findMany({
    where: {
      id: userId,
    },
  });

  return result;
};

const updateFlat = async (flatId: string, payload: TFlat) => {
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

const deleteFlat = async (flatId: string) => {
  console.log(flatId);

  try {
    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Delete all associated bookings first
      await prisma.booking.deleteMany({
        where: {
          flatId: flatId,
        },
      });

      // Then delete the flat
      const flat = await prisma.flat.delete({
        where: {
          id: flatId,
        },
      });

      return flat;
    });

    console.log("Flat deleted successfully:", result);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Failed to delete flat");
  }
};

export const flatService = {
  addFlat,
  getAllFlats,
  updateFlat,
  deleteFlat,
  getFlatByUserId,
};
