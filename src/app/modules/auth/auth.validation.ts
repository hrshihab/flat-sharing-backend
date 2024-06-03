import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    login: z.string(),
    password: z.string(),
  }),
});

export const authValidation = {
  loginValidation,
};
