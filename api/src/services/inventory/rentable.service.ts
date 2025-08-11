import type z from "zod";
import * as RentableModel from "../../model/inventory/rentable.model.js";
import * as PartService from "../../services/inventory/part.service.js";
import {
  Rentable,
  RentableCreateRequest,
  RentableCreateResponse,
  RentableUpdate,
} from "../../schemas/inventory/rentable.schema.js";

export async function getRentables() {
  const rentableRows = await RentableModel.getAllRentables();

  const parsedRentables = [];

  for (const row of rentableRows) {
    let parsedRentable;

    if (row.has_parts) {
      const parsedParts = await PartService.getPartsByRentableId(row.id);
      parsedRentable = Rentable.safeParse({
        id: row.id,
        name: row.name,
        description: row.description,
        has_parts: row.has_parts,
        availability: {
          id: row.availability_id,
          total: row.total,
          maintenance: row.maintenance,
          broken: row.broken,
        },
        parts: parsedParts,
      });
    } else {
      parsedRentable = Rentable.safeParse({
        id: row.id,
        name: row.name,
        description: row.description,
        has_parts: row.has_parts,
        availability: {
          id: row.availability_id,
          total: row.total,
          maintenance: row.maintenance,
          broken: row.broken,
        },
        parts: null,
      });
    }

    if (!parsedRentable.success) {
      throw new Error(
        `RentableService getRentables: Validation failed: ${parsedRentable.error.message}`
      );
    }

    parsedRentables.push(parsedRentable.data);
  }

  return parsedRentables;
}

export async function getRentableById(id: string) {
  const rentableRow = await RentableModel.getRentableById(id);

  if (rentableRow === undefined) {
    return rentableRow;
  }

  let parsedRentable;

  if (rentableRow.has_parts) {
    const parsedParts = await PartService.getPartsByRentableId(rentableRow.id);
    parsedRentable = Rentable.safeParse({
      id: rentableRow.id,
      name: rentableRow.name,
      description: rentableRow.description,
      has_parts: rentableRow.has_parts,
      availability: {
        id: rentableRow.availability_id,
        total: rentableRow.total,
        maintenance: rentableRow.maintenance,
        broken: rentableRow.broken,
      },
      parts: parsedParts,
    });
  } else {
    parsedRentable = Rentable.safeParse({
      id: rentableRow.id,
      name: rentableRow.name,
      description: rentableRow.description,
      has_parts: rentableRow.has_parts,
      availability: {
        id: rentableRow.availability_id,
        total: rentableRow.total,
        maintenance: rentableRow.maintenance,
        broken: rentableRow.broken,
      },
      parts: null,
    });
  }

  if (!parsedRentable.success) {
    throw new Error(
      `RentableService getRentableById: Validation failed: ${parsedRentable.error.message}`
    );
  }

  return parsedRentable.data;
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

export async function updateRentable(
  parsedRentableUpdate: z.infer<typeof RentableUpdate>
) {
  await RentableModel.updateRentable(
    parsedRentableUpdate.id,
    parsedRentableUpdate
  );

  const updatedRentable = await getRentableById(parsedRentableUpdate.id);

  if (updatedRentable === undefined) {
    throw new Error(
      `RentableService updateRentable: 404 not found post update:`
    );
  }

  return updatedRentable;
}

export async function deleteRentable(id: string) {
  return await RentableModel.deleteRentable(id);
}
