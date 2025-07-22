import express, { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import db from "../../db/client.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import { z } from "zod";
import {
  Rentable,
  RentableCreate,
} from "../../schemas/inventory/rentable.schema.js";
import type {
  Part,
  PartCreateAsComponent,
} from "../../schemas/inventory/part.schema.js";
import type { AvailabilitySchema } from "../../schemas/inventory/availability.schema.js";

/*
 * SERVICE FUNCTIONS FOR QUERY AND FORMATTING RESPONSES
 */
type RawRentableRow = {
  rentable_id: string;
  name: string;
  description: string | null;
  has_parts: boolean;
  availability_id: string;
  total: number;
  maintenance: number;
  broken: number;
};

type RawPartRow = {
  part_id: string;
  name: string;
  description: string | null;
  interchangeable: boolean;
  quantity: number;
  rentable_id: string;
  availability_id: string;
  total: number;
  maintenance: number;
  broken: number;
};

async function formatRentableCreate(
  row: RawRentableRow,
  parts: RawPartRow[] | null
) {
  const formattedAvailability: z.infer<typeof AvailabilitySchema> = {
    id: row.availability_id,
    total: row.total,
    maintenance: row.maintenance,
    broken: row.broken,
  };

  const formattedParts: z.infer<typeof Part>[] | null =
    parts?.map((part) => ({
      id: part.part_id,
      name: part.name,
      description: part.description,
      interchangeable: part.interchangeable,
      quantity: part.quantity,
      availability: {
        id: part.availability_id,
        total: part.total,
        maintenance: part.maintenance,
        broken: part.broken,
      },
      variants: null, // or populate if applicable
      rentable_id: part.rentable_id,
    })) ?? null;

  const formattedRentable: z.infer<typeof Rentable> = {
    id: row.rentable_id,
    name: row.name,
    description: row.description,
    has_parts: row.has_parts,
    availability: formattedAvailability,
    parts: formattedParts,
  };

  return formattedRentable;
}

// TODO FIX ERROR HANDLING
async function retrieveCreatedRentable(id: string) {
  const rentable_result = await db.query(
    `SELECT 
        r.id as rentable_id, 
        r.name, 
        r.description, 
        r.has_parts, 
        a.id as availability_id, 
        a.total, 
        a.maintenance, 
        a.broken
       FROM rentable r
       JOIN availability a ON r.availability_id = a.id
       WHERE r.id = $1`,
    [id]
  );

  if (!rentable_result.rows.length) {
    throw new Error("Failed to fetch availability for rentable");
  }

  const part_result = await db.query(
    `
    SELECT
      p.id as part_id,
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
    JOIN availability a ON p.availability_id = a.id
    WHERE p.rentable_id = $1`,
    [id]
  );

  return await formatRentableCreate(
    rentable_result.rows[0],
    part_result.rows.length ? part_result.rows : null
  );
}

// TODO FIX ERROR HANDLING
async function queryPartCreateAsComponent(
  parsedData: z.infer<typeof PartCreateAsComponent>[],
  rentable_id: string
) {
  try {
    for (const part of parsedData) {
      const part_result = await db.query(
        `INSERT INTO part (name, description, interchangeable, quantity, rentable_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, description, interchangeable, quantity, rentable_id`,
        [
          part.name,
          part.description ?? null,
          part.interchangeable,
          part.quantity,
          rentable_id,
        ]
      );
      if (!part_result.rows.length) {
        throw new Error("Part insert returned no rows");
      }
    }

    return;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}

// TODO FIX ERROR HANDLING
async function queryRentableCreate(parsedData: z.infer<typeof RentableCreate>) {
  try {
    const rentable_result = await db.query(
      `INSERT INTO rentable (name, description, has_parts)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, has_parts, availability_id`,
      [parsedData.name, parsedData.description ?? null, parsedData.has_parts]
    );

    if (!rentable_result.rows.length) {
      throw new Error("Rentable insert returned no rows");
    }

    if (
      parsedData.availability.total !== 0 ||
      parsedData.availability.maintenance !== 0 ||
      parsedData.availability.broken !== 0
    ) {
      await db.query(
        `UPDATE availability 
        SET total = $1,
            maintenance = $2,
            broken = $3
        WHERE id = $4
        RETURNING id, total, maintenance, broken`,
        [
          parsedData.availability.total,
          parsedData.availability.maintenance,
          parsedData.availability.broken,
          rentable_result.rows[0].availability_id,
        ]
      );
    }
    return rentable_result.rows[0].id;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}

/*
 * ROUTER CREATION
 */
const router: Router = express.Router();

router.post(
  "/rentable",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = RentableCreate.parse(req.body);

      await db.query("BEGIN");

      const rentableID = await queryRentableCreate(parsedBody);

      if (parsedBody.parts != null) {
        await queryPartCreateAsComponent(parsedBody.parts, rentableID);
      }

      const result = await retrieveCreatedRentable(rentableID);

      await db.query("COMMIT");
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
        return;
      }
      const appErr: AppError = new Error("Failed to create rentable");
      appErr.status = 500;
      appErr.cause = error;

      next(appErr);
    }
  }
);

export default router;
