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
const getBookingByFlatId = async (
  flatId: string,
  userId: string,
  userRole: string
) => {
  // Fetch the flat details to verify ownership
  const flat = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
    select: {
      userId: true, // Fetch only the userId of the creator
    },
  });

  if (!flat) {
    throw new Error("Flat not found");
  }
  console.log(flat, userId, userRole);
  // Check if the user is the creator or an admin
  if (flat.userId !== userId && userRole !== "ADMIN") {
    throw new Error("Access denied");
  }

  // Fetch the bookings if access is granted
  const result = await prisma.booking.findMany({
    where: {
      flatId: flatId,
    },
  });
  return result;
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

  if (!booking) {
    throw new Error("Booking not found");
  }

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

export const bookingService = {
  createBooking,
  getBooking,
  updateStatus,
  getBookingByUserId,
  getBookingByFlatId,
};
