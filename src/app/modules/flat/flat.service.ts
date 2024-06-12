import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TFlat } from "./flat.interface";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { sendImageToCloudinary } from "../../../shared/sendImageToCloudinary";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { USER_ROLE } from "../User/User.constant";
import { IAuthUser } from "../../interface/common";

const addFlat = async (payload: TFlat) => {
  try {
    //console.log(payload);
    // const imageUrls = [];
    // if (files && files.length > 0) {
    //   for (const file of files) {
    //     const imageName = `flat-${payload.rentAmount}-${file.originalname}`;
    //     const path = file.path;
    //     const response = await sendImageToCloudinary(imageName, path);
    //     const { secure_url } = response as { secure_url: string };
    //     imageUrls.push(secure_url);
    //   }
    // }
    console.log(payload);

    const result = await prisma.flat.create({
      data: payload,
    });

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
};

const getFlatsFromDB = async (
  user: IAuthUser,
  filters: any,
  options: IPaginationOptions & {
    location?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
  }
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { location, priceMin, priceMax, bedrooms } = filters;
  //console.log(priceMax, priceMin, location, bedrooms);

  const andConditions: Prisma.FlatWhereInput[] = [];

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
    const rentFilter: any = {};
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

  const whereConditions: Prisma.FlatWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flat.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
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
  //console.log(userId);
  const result = await prisma.flat.findMany({
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
};

const getSingleFlatFromDB = async (id: string) => {
  const result = await prisma.flat.findFirstOrThrow({
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
};

const updateFlat = async (flatId: string, payload: Partial<TFlat>) => {
  //console.log(flatId, payload);
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: payload,
  });

  return result;
};

const updateMyFlatDataIntoDB = async (
  id: string,
  userId: string,
  payload: any
) => {
  await prisma.flat.findFirstOrThrow({
    where: {
      id,
      userId,
    },
  });

  const result = await prisma.flat.update({
    where: {
      id,
      userId,
    },
    data: payload,
  });
  return result;
};

const deleteFlat = async (flatId: string) => {
  //console.log(flatId);

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

    //console.log("Flat deleted successfully:", result);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Failed to delete flat");
  }
};

export const flatService = {
  addFlat,
  getFlatsFromDB,
  getSingleFlatFromDB,
  updateMyFlatDataIntoDB,
  updateFlat,
  deleteFlat,
  getFlatByUserId,
};
