import { z } from "zod";
import {
  AvailabilityCreate,
  AvailabilitySchema,
} from "./availability.schema.js";
import {
  PartVariant,
  PartVariantCreate,
  PartVariantUpdate,
} from "./partvariant.schema.js";

export const Part = z
  .object({
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
    interchangeable: z.boolean(),
    quantity: z
      .number()
      .int()
      .positive("Part: Quantity must positive integer."),
    rentable_id: z.string().uuid("Part: rentable_id must be valid UUID"),
    availability: AvailabilitySchema.nullable(),
    variants: z.array(PartVariant).nullable(),
  })
  .refine((data) => !(data.interchangeable && data.availability !== null), {
    message: "Part: If interchangeable is true, availability must be null.",
    path: ["availability"],
  })
  .refine((data) => !(!data.interchangeable && data.availability === null), {
    message: "Part: If not interchangeable, availability must exist.",
    path: ["availability"],
  })
  .refine((data) => !(data.interchangeable && data.variants === null), {
    message: "Part: If interchangeable, variants must exist.",
    path: ["variants"],
  })
  .refine(
    (data) =>
      !(
        data.interchangeable &&
        data.variants !== null &&
        data.variants.length === 0
      ),
    {
      message: "Part: If interchangeable, variants may not be empty.",
      path: ["variants"],
    }
  )
  .refine((data) => !(!data.interchangeable && data.variants !== null), {
    message: "Part: If not interchangeable, variants cannot exist.",
    path: ["variants"],
  });

export const PartCreate = z
  .object({
    name: z
      .string()
      .min(1, "PartCreate: name must contain at least one character.")
      .max(32, "PartCreate: name exceeds limit of 32 characters."),
    description: z
      .string()
      .min(1, "PartCreate: description must contain at least one character.")
      .max(255, "PartCreate: description exceeds limit of 255 characters.")
      .nullable(),
    interchangeable: z.boolean(),
    quantity: z
      .number()
      .int()
      .positive("PartCreate: Quantity must positive integer."),
    rentable_id: z.string().uuid("Part: rentable_id must be valid UUID"),
    availability: AvailabilityCreate.nullable(),
    variants: z.array(PartVariantCreate).nullable(),
  })
  .refine((data) => !(data.interchangeable && data.availability !== null), {
    message:
      "PartCreate: If interchangeable is true, availability must be null.",
    path: ["availability"],
  })
  .refine((data) => !(data.interchangeable && data.variants === null), {
    message: "PartCreate: If interchangeable, variants must exist.",
    path: ["parts"],
  })
  .refine(
    (data) =>
      !(
        data.interchangeable &&
        data.variants !== null &&
        data.variants.length === 0
      ),
    {
      message: "Part: If interchangeable, variants may not be empty.",
      path: ["variants"],
    }
  )
  .refine((data) => !(!data.interchangeable && data.variants !== null), {
    message: "PartCreate: If not interchangeable, variants cannot exist.",
    path: ["variants"],
  });

export const PartCreateRequest = z
  .object({
    name: z
      .string()
      .min(1, "PartCreate: name must contain at least one character.")
      .max(32, "PartCreate: name exceeds limit of 32 characters."),
    description: z
      .string()
      .min(1, "PartCreate: description must contain at least one character.")
      .max(255, "PartCreate: description exceeds limit of 255 characters.")
      .nullable(),
    interchangeable: z.boolean(),
    rentable_id: z.string().uuid().optional(),
    quantity: z
      .number()
      .int()
      .positive("PartCreate: Quantity must positive integer."),
    availability: AvailabilityCreate.nullable(),
    variants: z.array(PartVariantCreate).nullable(),
  })
  .refine((data) => !(data.interchangeable && data.availability !== null), {
    message:
      "PartCreate: If interchangeable is true, availability must be null.",
    path: ["availability"],
  })
  .refine((data) => !(data.interchangeable && data.variants === null), {
    message: "PartCreate: If interchangeable, variants must exist.",
    path: ["parts"],
  })
  .refine(
    (data) =>
      !(
        data.interchangeable &&
        data.variants !== null &&
        data.variants.length === 0
      ),
    {
      message: "Part: If interchangeable, variants may not be empty.",
      path: ["variants"],
    }
  )
  .refine((data) => !(!data.interchangeable && data.variants !== null), {
    message: "PartCreate: If not interchangeable, variants cannot exist.",
    path: ["variants"],
  });

export const PartCreateResponse = z
  .object({
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
    interchangeable: z.boolean(),
    rentable_id: z.string().uuid(),
    quantity: z
      .number()
      .int()
      .positive("PartCreate: Quantity must positive integer."),
    availability: AvailabilitySchema.nullable(),
  })
  .refine((data) => !(data.interchangeable && data.availability !== null), {
    message:
      "PartCreate: If interchangeable is true, availability must be null.",
    path: ["availability"],
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
    interchangeable: z.boolean(),
    quantity: z
      .number()
      .int()
      .positive("PartUpdate: Quantity must positive integer.")
      .nullable(),
    variants: z.array(PartVariantUpdate).nullable(),
  })
  .refine((data) => !(data.interchangeable && data.variants === null), {
    message: "PartUpdate: If interchangeable, variants must exist.",
    path: ["parts"],
  })
  .refine(
    (data) =>
      !(
        data.interchangeable &&
        data.variants !== null &&
        data.variants.length === 0
      ),
    {
      message: "Part: If interchangeable, variants may not be empty.",
      path: ["variants"],
    }
  )
  .refine((data) => !(!data.interchangeable && data.variants !== null), {
    message: "PartUpdate: If not interchangeable, variants cannot exist.",
    path: ["variants"],
  })
  .refine(
    (data) =>
      !(
        data.name === null &&
        data.description === null &&
        data.interchangeable === null &&
        data.quantity === null &&
        data.variants === null
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
        data.interchangeable === null &&
        data.quantity === null &&
        data.variants !== null &&
        data.variants.length === 0
      ),
    {
      message: "PartUpdate: Update contains no changes, rejected.",
      path: [],
    }
  );
