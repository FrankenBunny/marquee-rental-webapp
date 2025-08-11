import type z from "zod";
import db from "../../db/client.js";
import type { AvailabilityUpdateSchema } from "../../schemas/inventory/availability.schema.js";
import { buildPatchQuery } from "../../services/patchQuery.js";

export async function getAvailability(id: string) {
  const result = await db.query(
    `
    SELECT * 
    FROM availability 
    WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount && result.rowCount > 1) {
    throw new Error(
      `AvailabilityModel getAvailability: Returned more than 1 row`
    );
  }

  if (result.rowCount === 0) {
    return undefined;
  }

  return result.rows[0];
}

export async function updateAvailability(
  parsedAvailability: z.infer<typeof AvailabilityUpdateSchema>,
  id: string
) {
  const patchQueryResult = await buildPatchQuery(id, parsedAvailability, {
    tableName: "availability",
    allowedFields: ["total", "maintenance", "broken"],
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
