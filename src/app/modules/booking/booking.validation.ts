import z from "zod";

const bookingStatusValidation = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  }),
});

const createBookingValidation = z.object({
  body: z.object({
    flatId: z.string(),
    name: z.string(),
    age: z.number(),
    profession: z.string(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "SEPARATED"]).optional(),
    PresentAddress: z.string(),
    phoneNo: z.string(),
  }),
});

export const bookingValidation = {
  bookingStatusValidation,
  createBookingValidation,
};
