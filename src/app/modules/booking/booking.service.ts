import prisma from "../../../shared/prisma";
import { Status } from "./booking.constant";
import { IBooking } from "./booking.interface";

const createBooking = async (payload: IBooking) => {
  const result = await prisma.booking.create({
    data: {
      ...payload,
      status: Status.PENDING,
    },
  });
  return result;
};
// get all flat booking request for admin
const getBooking = async () => {
  const result = await prisma.booking.findMany();
  const total = await prisma.booking.count();
  return {
    total,
    result,
  };
};
// how many flat booking request by userId
const getBookingByUserId = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      userId: userId,
    },
  });
  return result;
};

// get all booking request by flatId
const getBookingByFlatId = async (userId: string, userRole: string) => {
  // Fetch the flats owned by the user and include bookings
  const flats = await prisma.flat.findMany({
    where: {
      userId: userId,
    },
    include: {
      booking: true,
    },
  });

  //console.log(flats, "flats");

  if (!flats.length) {
    throw new Error("No flats found for the given user");
  }

  // Combine bookings from all flats into a single array
  const bookings = flats.flatMap((flat) => flat.booking);

  //console.log(bookings, "bookings");

  //If the user is not the owner of the flat and not an admin, deny access
  if (userRole !== "ADMIN") {
    const isOwner = flats.some((flat) => flat.userId === userId);
    if (!isOwner) {
      throw new Error("Access denied");
    }
  }

  return bookings;
};
// Update booking Status
const updateStatus = async (
  bookingId: string,
  payload: any,
  userId: string,
  userRole: string
) => {
  const { status } = payload;

  // Fetch the booking details to verify ownership
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    select: {
      flat: {
        select: {
          userId: true, // Fetch the userId of the creator of the flat
        },
      },
    },
  });
  //  // console.log(
  //     "userId",
  //     userId,
  //     "bookingId",
  //     bookingId,
  //     "userRole",
  //     userRole,
  //     "status",
  //     status
  //   );

  if (!booking) {
    throw new Error("Booking not found");
  }
  // console.log(booking.flat.userId !== userId && userRole !== "ADMIN");

  // Check if the user is the creator of the flat or an admin
  if (booking.flat.userId !== userId && userRole !== "ADMIN") {
    throw new Error("Access denied");
  }
  // Update the booking status if access is granted
  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: status,
    },
  });
  return result;
};
const updateStatusByUser = async (
  bookingId: string,
  payload: any,
  userId: string,
  userRole: string
) => {
  const { status } = payload;

  // Fetch the booking details to verify ownership
  const flat = await prisma.flat.findMany({
    where: {
      userId: userId,
    },
    include: {
      booking: true,
    },
  });
  // console.log(
  //   "userId",
  //   userId,
  //   "bookingId",
  //   bookingId,
  //   "userRole",
  //   userRole,
  //   "status",
  //   status
  // );

  if (!flat) {
    throw new Error("Booking not found");
  }
  //console.log(flat);

  // Check if the user is the creator of the flat or an admin
  // if (booking.flat.userId !== userId && userRole !== "ADMIN") {
  //   throw new Error("Access denied");
  // }
  // Update the booking status if access is granted
  // const result = await prisma.booking.update({
  //   where: {
  //     id: bookingId,
  //   },
  //   data: {
  //     status: status,
  //   },
  // });
  // return result;
};

export const bookingService = {
  createBooking,
  getBooking,
  updateStatus,
  getBookingByUserId,
  getBookingByFlatId,
  updateStatusByUser,
};
