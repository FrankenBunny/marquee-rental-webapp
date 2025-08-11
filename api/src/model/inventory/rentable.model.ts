import type z from "zod";
import db from "../../db/client.js";
import {
  RentableCreateRequest,
  RentableUpdate,
} from "../../schemas/inventory/rentable.schema.js";
import { buildPatchQuery } from "../../services/patchQuery.js";

export async function getAllRentables() {
  const result = await db.query(
    `
    SELECT 
        r.id,
        r.name,
        r.description,
        r.has_parts,
        a.id as availability_id,
        a.total,
        a.maintenance,
        a.broken
    FROM rentable r
    JOIN availability a
    ON r.availability_id = a.id
    `
  );

  return result.rows;
}

export async function getRentableById(id: string) {
  const result = await db.query(
    `
    SELECT 
        r.id,
        r.name,
        r.description,
        r.has_parts,
        a.id as availability_id,
        a.total,
        a.maintenance,
        a.broken
    FROM rentable r
    JOIN availability a
    ON r.availability_id = a.id
    WHERE r.id = $1
    `,
    [id]
  );

  if (result.rowCount && result.rowCount > 1) {
    throw new Error(`RentableModel getRentableById: Returned more than 1 row`);
  }

  if (result.rowCount === 0) {
    return undefined;
  }

  return result.rows[0];
}

export async function createRentable(
  parsedRentable: z.infer<typeof RentableCreateRequest>
) {
  const insert_result = await db.query(
    `
    INSERT INTO rentable (name, description, has_parts)
    VALUES ($1, $2, $3)
    RETURNING id, availability_id`,
    [
      parsedRentable.name,
      parsedRentable.description ?? null,
      parsedRentable.has_parts,
    ]
  );

  if (parsedRentable.availability != null) {
    await db.query(
      `
    UPDATE availability 
    SET total = $1,
        maintenance = $2,
        broken = $3
    WHERE id = $4
    RETURNING id, total, maintenance, broken`,
      [
        parsedRentable.availability.total,
        parsedRentable.availability.maintenance,
        parsedRentable.availability.broken,
        insert_result.rows[0].availability_id,
      ]
    );
  }

  const full_result = await db.query(
    `
    SELECT 
        r.id,
        r.name,
        r.description,
        r.has_parts,
        a.id as availability_id,
        a.total,
        a.maintenance,
        a.broken
    FROM rentable r
    JOIN availability a
    ON r.availability_id = a.id
    WHERE r.id = $1
    `,
    [insert_result.rows[0].id]
  );

  return full_result.rows[0];
}

export async function updateRentable(
  id: string,
  parsedRentable: z.infer<typeof RentableUpdate>
) {
  const patchQueryResult = await buildPatchQuery(id, parsedRentable, {
    tableName: "rentable",
    allowedFields: ["name", "description", "has_parts"],
    transformFields: (field, value) => {
      if (typeof value === "string") {
        return value.trim();
      }
      return value;
    },
  });

  if (!patchQueryResult) {
    throw new Error("No valid fields to update");
  }

  const result = await db.query(
    patchQueryResult.query,
    patchQueryResult.values
  );

  return result.rows[0];
}

export async function deleteRentable(id: string) {
  const result = await db.query(
    `
    DELETE FROM rentable
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}
