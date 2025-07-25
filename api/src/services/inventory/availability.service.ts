import type z from "zod";
import * as AvailabilityModel from "../../model/inventory/availability.model.js";
import type { AvailabilityUpdateSchema } from "../../schemas/inventory/availability.schema.js";

export async function getAvailability(id: string) {
  return await AvailabilityModel.getAvailability(id);
}

export async function updateAvailability(
  parsedAvailability: z.infer<typeof AvailabilityUpdateSchema>,
  id: string
) {
  return await AvailabilityModel.updateAvailability(parsedAvailability, id);
}
