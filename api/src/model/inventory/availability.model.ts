import type z from "zod";
import db from "../../db/client.js";
import type { AvailabilityUpdateSchema } from "../../schemas/inventory/availability.schema.js";

export async function getAvailability(id: string) {
  const result = await db.query(
    `
    SELECT * 
    FROM availability 
    WHERE id = $1
    `,
    [id]
  );
  return result;
}

export async function updateAvailability(
  parsedAvailability: z.infer<typeof AvailabilityUpdateSchema>,
  id: string
) {
  const result = await db.query(
    `
    UPDATE availability 
        SET total = $1,
            maintenance = $2,
            broken = $3
        WHERE id = $4
        RETURNING id, total, maintenance, broken
    `,
    [
      parsedAvailability.total,
      parsedAvailability.maintenance,
      parsedAvailability.broken,
      id,
    ]
  );

  return result;
}
