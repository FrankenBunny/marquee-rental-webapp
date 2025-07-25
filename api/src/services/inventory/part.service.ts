import type z from "zod";
import {
  PartCreateResponse,
  type PartCreate,
} from "../../schemas/inventory/part.schema.js";
import * as PartModel from "../../model/inventory/part.model.js";

export async function createPart(parsedPart: z.infer<typeof PartCreate>) {
  const partData = await PartModel.createPart(parsedPart);
  const parsedResult = PartCreateResponse.safeParse({
    id: partData.id,
    name: partData.name,
    description: partData.description,
    interchangeable: partData.interchangeable,
    quantity: partData.quantity,
    availability: {
      id: partData.availability_id,
      total: partData.total,
      maintenance: partData.maintenance,
      broken: partData.broken,
    },
    rentable_id: partData.rentable_id,
  });

  if (!parsedResult.success) {
    throw new Error(
      `PartService createPart: Validation failed: ${parsedResult.error}`
    );
  }

  return parsedResult.data;
}
