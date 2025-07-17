import { z } from "zod";

export const AvailabilityCreate = z
  .object({
    total: z.number().int().nonnegative().default(0),
    maintenance: z.number().int().nonnegative().default(0),
    broken: z.number().int().nonnegative().default(0),
  })
  .refine((data) => data.maintenance + data.broken <= data.total, {
    message: "The sum of maintenance and broken may not exceed total.",
    path: [],
  });

/**
 * Schema for representing Availability entry.
 *
 * @property {uuid} id - UUID Identifier
 * @property {int} total - Total count, must be positive integer.
 * @property {int} maintenance - Count in maintentance, must be positive integer.
 * @property {int} broken - Count of broken, must be positive integer.
 */
export const AvailabilitySchema = z
  .object({
    id: z.string().uuid(),
    total: z.number().int().nonnegative(),
    maintenance: z.number().int().nonnegative(),
    broken: z.number().int().nonnegative(),
  })
  .refine((data) => data.maintenance + data.broken <= data.total, {
    message: "The sum of maintenance and broken may not exceed total.",
    path: [],
  });

/**
 * Schema used for updating Availability entry.
 *
 * @property {uuid} id - UUID Identifier
 * @property {int} total - Total count, must be positive integer.
 * @property {int} maintenance - Count in maintentance, must be positive integer.
 * @property {int} broken - Count of broken, must be positive integer.
 */
export const AvailabilityUpdateSchema = z.object({
  total: z.number().int().nonnegative().optional(),
  maintenance: z.number().int().nonnegative().optional(),
  broken: z.number().int().nonnegative().optional(),
});
