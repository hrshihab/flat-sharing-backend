import { z } from "zod";

const userCreateValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  }),
});

const userUpdateValidationSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z.string().optional(),
  }),
});

export const userValidation = {
  userCreateValidationSchema,
  userUpdateValidationSchema,
};
