import { z } from "zod";
import { AvailabilitySchema } from "./availability.schema.js";

/**
 * Schema representing an Item tuple.
 *
 * @property {uuid} id - UUID Identifier
 * @property {string} name - Max 32 characters
 * @property {string} description - Nullable, max 255 characters.
 * @property {uuid} availability_id - UUID Identifier
 */
export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(32),
  description: z.string().max(255).nullable(),
  availability_id: z.string().uuid(),
});

/**
 * Schema for creating Item tuple.
 *
 * @property {string} name - Max 32 characters
 * @property {string} description - Nullable, max 255 characters
 */
export const ItemCreateSchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).nullable(),
});

/**
 * Schema for updating Item tuple.
 *
 * Either name or description has to be set, otherwise the parsing will fail.
 *
 * @property {string} name - Optional, max 32 characters
 * @property {string} description - Optional, max 255 characters.
 */
export const ItemUpdateSchema = z
  .object({
    name: z.string().max(32).optional(),
    description: z.string().max(255).optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one of 'name' or 'description' must be provided",
  });

/**
 * Schema representing Item with nested availability tuple.
 *
 * @property {uuid} id - UUID Identifier
 * @property {string} name - Max 32 characters
 * @property {string} description - Nullable, max 255 characters
 * @property {string} availability - Availability tuple.
 */
export const ItemWithAvailabilitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  availability: AvailabilitySchema,
});
