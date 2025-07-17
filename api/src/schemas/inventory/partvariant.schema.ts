import { z } from "zod";
import {
  AvailabilityCreate,
  AvailabilitySchema,
} from "./availability.schema.js";

export const PartVariant = z.object({
  id: z.string().uuid("PartVariant: id must be valid UUID."),
  name: z
    .string()
    .min(1, "PartVariant: name must contain at least one character.")
    .max(32, "PartVariant: name exceeds limit of 32 characters."),
  description: z
    .string()
    .min(1, "PartVariant: description must contain at least one character.")
    .max(255, "PartVariant: description exceeds limit of 255 characters.")
    .nullable(),
  part_id: z.string().uuid("PartVariant: part_id must be valid UUID."),
  availability: AvailabilitySchema,
});

export const PartVariantCreate = z.object({
  name: z
    .string()
    .min(1, "PartVariant: name must contain at least one character.")
    .max(32, "PartVariant: name exceeds limit of 32 characters."),
  description: z
    .string()
    .min(1, "PartVariant: description must contain at least one character.")
    .max(255, "PartVariant: description exceeds limit of 255 characters.")
    .nullable(),
  part_id: z.string().uuid("PartVariant: part_id must be valid UUID."),
  availability: AvailabilityCreate,
});

export const PartVariantUpdate = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(32).nullable(),
    description: z.string().max(255).nullable(),
  })
  .refine((data) => !(data.name === null && data.description === null), {
    message: "PartVariant: Update contains no changes, rejected.",
    path: [],
  });
