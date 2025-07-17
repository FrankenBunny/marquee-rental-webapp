import { z } from "zod";
import {
  AvailabilityCreate,
  AvailabilitySchema,
} from "./availability.schema.js";
import { Part, PartCreate, PartUpdate } from "./part.schema.js";

export const Rentable = z
  .object({
    id: z.string().uuid("Rentable: id must be valid UUID"),
    name: z
      .string()
      .min(1, "Rentable: name must contain at least one character.")
      .max(32, "Rentable: name exceeds limit of 32 characters."),
    description: z
      .string()
      .min(1, "Rentable: description must contain at least one character.")
      .max(255, "Rentable: description exceeds limit of 255 characters.")
      .nullable(),
    availability: AvailabilitySchema,
    has_parts: z.boolean(),
    parts: z.array(Part).nullable(),
  })
  .refine((data) => !(data.has_parts && data.parts === null), {
    message: "Rentable: If has_parts, parts must exist.",
    path: ["parts"],
  })
  .refine(
    (data) =>
      !(data.has_parts && data.parts !== null && data.parts.length == 0),
    {
      message: "Rentable: If has_parts, parts may not be empty array.",
      path: ["parts"],
    }
  );

export const RentableCreate = z
  .object({
    name: z
      .string()
      .min(1, "Rentable: name must contain at least one character.")
      .max(32, "Rentable: name exceeds limit of 32 characters."),
    description: z
      .string()
      .min(1, "Rentable: description must contain at least one character.")
      .max(255, "Rentable: description exceeds limit of 255 characters.")
      .nullable(),
    availability: AvailabilityCreate,
    has_parts: z.boolean(),
    parts: z.array(PartCreate).nullable(),
  })
  .refine((data) => !(data.has_parts && data.parts === null), {
    message: "Rentable: If has_parts, parts must exist.",
    path: ["parts"],
  })
  .refine(
    (data) =>
      !(data.has_parts && data.parts !== null && data.parts.length == 0),
    {
      message: "Rentable: If has_parts, parts may not be empty array.",
      path: ["parts"],
    }
  );

export const RentableUpdate = z
  .object({
    id: z.string().uuid("Rentable: id must be valid UUID"),
    name: z
      .string()
      .min(1, "Rentable: name must contain at least one character.")
      .max(32, "Rentable: name exceeds limit of 32 characters.")
      .nullable(),
    description: z
      .string()
      .min(1, "Rentable: description must contain at least one character.")
      .max(255, "Rentable: description exceeds limit of 255 characters.")
      .nullable(),
    has_parts: z.boolean().nullable(),
    parts: z.array(PartUpdate).nullable(),
  })
  .refine((data) => !(data.has_parts && data.parts === null), {
    message: "Rentable: If has_parts, parts must exist.",
    path: ["parts"],
  })
  .refine(
    (data) =>
      !(data.has_parts && data.parts !== null && data.parts.length == 0),
    {
      message: "Rentable: If has_parts, parts may not be empty array.",
      path: ["parts"],
    }
  )
  .refine(
    (data) =>
      !(
        data.name === null &&
        data.description === null &&
        data.has_parts === null &&
        data.parts === null
      ),
    {
      message: "Rentable: update contains no changes, rejected.",
    }
  )
  .refine(
    (data) =>
      !(
        data.name === null &&
        data.description === null &&
        data.has_parts === null &&
        data.parts !== null &&
        data.parts.length === 0
      ),
    {
      message: "Rentable: update contains no changes, rejected.",
    }
  );
