import type z from "zod";
import * as RentableModel from "../../model/inventory/rentable.model.js";
import {
  RentableCreateRequest,
  RentableCreateResponse,
} from "../../schemas/inventory/rentable.schema.js";

export async function getRentables() {
  return await RentableModel.getAllRentables();
}

export async function createRentable(
  parsedRentable: z.infer<typeof RentableCreateRequest>
) {
  const rentableData = await RentableModel.createRentable(parsedRentable);
  const parsedResult = RentableCreateResponse.safeParse({
    id: rentableData.id,
    name: rentableData.name,
    description: rentableData.description,
    has_parts: rentableData.has_parts,
    availability: {
      id: rentableData.availability_id,
      total: rentableData.total,
      maintenance: rentableData.maintenance,
      broken: rentableData.broken,
    },
  });

  if (!parsedResult.success) {
    throw new Error(
      `RentableService createRentable: Validation failed: ${parsedResult.error.message}`
    );
  }

  return parsedResult.data;
}
