import type z from "zod";
import db from "../../db/client.js";
import type { PartCreate } from "../../schemas/inventory/part.schema.js";

export async function getAllParts() {
  const result = await db.query(`SELECT * FROM part`);
  return result.rows;
}

export async function createPart(parsedPart: z.infer<typeof PartCreate>) {
  const insert_result = await db.query(
    `
    INSERT INTO part 
        (name, description, interchangeable, quantity, rentable_id)
    VALUES 
        ($1, $2, $3, $4, $5)
    RETURNING id, name, description, interchangeable, quantity, rentable_id, availability_id
    `,
    [
      parsedPart.name,
      parsedPart.description ?? null,
      parsedPart.interchangeable,
      parsedPart.quantity,
      parsedPart.rentable_id,
    ]
  );

  if (parsedPart.availability != null) {
    await db.query(
      `
    UPDATE availability 
    SET total = $1,
        maintenance = $2,
        broken = $3
    WHERE id = $4
    RETURNING id, total, maintenance, broken`,
      [
        parsedPart.availability.total,
        parsedPart.availability.maintenance,
        parsedPart.availability.broken,
        insert_result.rows[0].availability_id,
      ]
    );
  }

  const full_result = await db.query(
    `
    SELECT 
        p.id,
        p.name,
        p.description,
        p.interchangeable,
        p.quantity,
        p.rentable_id,
        a.id as availability_id,
        a.total,
        a.maintenance,
        a.broken
    FROM part p
    JOIN availability a
    ON p.availability_id = a.id
    WHERE p.id = $1
    `,
    [insert_result.rows[0].id]
  );

  return full_result.rows[0];
}
