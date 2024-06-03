import { z } from "zod";

const flatValidation = z.object({
  body: z.object({
    location: z.string(),
    description: z.string(),
    rentAmount: z.number(),
    bedrooms: z.number(),
    amenities: z.array(z.string()),
  }),
});

const flatUpdateValidation = z.object({
  body: z.object({
    location: z.string().optional(),
    description: z.string().optional(),
    rentAmount: z.number().optional(),
    bedrooms: z.number().optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

export const flatValidationSchema = {
  flatValidation,
  flatUpdateValidation,
};
