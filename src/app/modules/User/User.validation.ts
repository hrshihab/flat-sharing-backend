import e from "express";
import { z } from "zod";

const userCreateValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  }),
});

const userProfileUpdateValidationSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    profilePhoto: z.string().optional(),
  }),
});

const userUpdateValidationSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    status: z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
    // role will be ADMIN or USER
    role: z.enum(["ADMIN", "USER"]).optional(),
  }),
});

export const userValidation = {
  userCreateValidationSchema,
  userUpdateValidationSchema,
  userProfileUpdateValidationSchema,
};
