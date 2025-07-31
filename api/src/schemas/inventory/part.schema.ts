import { z } from "zod";
import {
  AvailabilityCreate,
  AvailabilitySchema,
} from "./availability.schema.js";

export const Part = z.object({
  id: z.string().uuid("Part: id must be valid UUID"),
  name: z
    .string()
    .min(1, "Part: name must contain at least one character.")
    .max(32, "Part: name exceeds limit of 32 characters."),
  description: z
    .string()
    .min(1, "Part: description must contain at least one character.")
    .max(255, "Part: description exceeds limit of 255 characters.")
    .nullable(),
  quantity: z.number().int().positive("Part: Quantity must positive integer."),
  rentable_id: z.string().uuid("Part: rentable_id must be valid UUID"),
  availability: AvailabilitySchema.nullable(),
});

export const PartCreate = z.object({
  name: z
    .string()
    .min(1, "PartCreate: name must contain at least one character.")
    .max(32, "PartCreate: name exceeds limit of 32 characters."),
  description: z
    .string()
    .min(1, "PartCreate: description must contain at least one character.")
    .max(255, "PartCreate: description exceeds limit of 255 characters.")
    .nullable(),
  quantity: z
    .number()
    .int()
    .positive("PartCreate: Quantity must positive integer."),
  rentable_id: z.string().uuid("Part: rentable_id must be valid UUID"),
  availability: AvailabilityCreate.nullable(),
});

export const PartCreateRequest = z.object({
  name: z
    .string()
    .min(1, "PartCreate: name must contain at least one character.")
    .max(32, "PartCreate: name exceeds limit of 32 characters."),
  description: z
    .string()
    .min(1, "PartCreate: description must contain at least one character.")
    .max(255, "PartCreate: description exceeds limit of 255 characters.")
    .nullable(),
  rentable_id: z.string().uuid().optional(),
  quantity: z
    .number()
    .int()
    .positive("PartCreate: Quantity must positive integer."),
  availability: AvailabilityCreate.nullable(),
});

export const PartCreateResponse = z.object({
  id: z.string().uuid("Part: id must be valid UUID"),
  name: z
    .string()
    .min(1, "PartCreate: name must contain at least one character.")
    .max(32, "PartCreate: name exceeds limit of 32 characters."),
  description: z
    .string()
    .min(1, "PartCreate: description must contain at least one character.")
    .max(255, "PartCreate: description exceeds limit of 255 characters.")
    .nullable(),
  rentable_id: z.string().uuid(),
  quantity: z
    .number()
    .int()
    .positive("PartCreate: Quantity must positive integer."),
  availability: AvailabilitySchema.nullable(),
});

export const PartUpdate = z
  .object({
    id: z.string().uuid("PartUpdate: id must be valid UUID"),
    name: z
      .string()
      .min(1, "PartUpdate: name must contain at least one character.")
      .max(32, "PartUpdate: name exceeds limit of 32 characters.")
      .nullable(),
    description: z
      .string()
      .min(1, "PartUpdate: description must contain at least one character.")
      .max(255, "PartUpdate: description exceeds limit of 255 characters.")
      .nullable(),
    quantity: z
      .number()
      .int()
      .positive("PartUpdate: Quantity must positive integer.")
      .nullable(),
  })
  .refine(
    (data) =>
      !(
        data.name === null &&
        data.description === null &&
        data.quantity === null
      ),
    {
      message: "PartUpdate: Update contains no changes, rejected.",
      path: [],
    }
  )
  .refine(
    (data) =>
      !(
        data.name === null &&
        data.description === null &&
        data.quantity === null
      ),
    {
      message: "PartUpdate: Update contains no changes, rejected.",
      path: [],
    }
  );
