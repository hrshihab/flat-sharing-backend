import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string(),
  }),
});

export const authValidation = {
  loginValidation,
};
