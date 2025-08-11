import type z from "zod";
import {
  Part,
  PartCreateResponse,
  PartCreate,
  PartUpdate,
} from "../../schemas/inventory/part.schema.js";
import * as PartModel from "../../model/inventory/part.model.js";

export async function createPart(parsedPart: z.infer<typeof PartCreate>) {
  const partData = await PartModel.createPart(parsedPart);
  const parsedResult = PartCreateResponse.safeParse({
    id: partData.id,
    name: partData.name,
    description: partData.description,
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

export async function getPartsByRentableId(id: string) {
  const partRows = await PartModel.getPartsByRentableId(id);

  const parsedParts = [];

  for (const partRow of partRows) {
    const parsedPart = Part.safeParse({
      id: partRow.id,
      name: partRow.name,
      description: partRow.description,
      quantity: partRow.quantity,
      availability: {
        id: partRow.availability_id,
        total: partRow.total,
        maintenance: partRow.maintenance,
        broken: partRow.broken,
      },
      rentable_id: partRow.rentable_id,
    });

    if (!parsedPart.success) {
      throw new Error(
        `PartService getPartsByRentableId: Validation failed: ${parsedPart.error}`
      );
    }

    parsedParts.push(parsedPart.data);
  }

  return parsedParts;
}

export async function getPartById(id: string) {
  return await PartModel.getPartById(id);
}

export async function updatePart(
  id: string,
  parsedPartUpdate: z.infer<typeof PartUpdate>
) {
  await PartModel.updatePart(id, parsedPartUpdate);

  const updatedPart = await getPartById(id);

  if (updatedPart === undefined) {
    throw new Error(`PartService updatePart: 404 not found post update:`);
  }

  return updatedPart;
}

export async function deletePart(id: string) {
  return await PartModel.deletePart(id);
}
