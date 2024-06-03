import z from "zod";

const bookingStatusValidation = z.object({
  body: z.object({
    status: z.enum(["PENDING", "BOOKED", "REJECTED"]),
  }),
});

const createBookingValidation = z.object({
  body: z.object({
    flatId: z.string(),
    userId: z.string(),
    profession: z.string(),
    maritalStatus: z.string(),
    PresentAddress: z.string(),
    phoneNo: z.string(),
  }),
});

export const bookingValidation = {
  bookingStatusValidation,
  createBookingValidation,
};
