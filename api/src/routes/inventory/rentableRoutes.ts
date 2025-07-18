import express, { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import db from "../../db/client.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import { z } from "zod";
import {
  Rentable,
  RentableCreate,
} from "../../schemas/inventory/rentable.schema.js";
import type { PartCreate } from "../../schemas/inventory/part.schema.js";
import type { AvailabilitySchema } from "../../schemas/inventory/availability.schema.js";

/*
 * SERVICE FUNCTIONS FOR QUERY AND FORMATTING RESPONSES
 */
type RawRentableRow = {
  id: string;
  name: string;
  description: string | null;
  has_parts: boolean;
  availability_id: string;
  total: number;
  maintenance: number;
  broken: number;
};

async function formatRentableCreate(
  row: RawRentableRow,
  parts: z.infer<typeof PartCreate>[] | null
) {
  const availability: z.infer<typeof AvailabilitySchema> = {
    id: row.availability_id,
    total: row.total,
    maintenance: row.maintenance,
    broken: row.broken,
  };

  const rentable: z.infer<typeof Rentable> = {
    id: row.id,
    name: row.name,
    description: row.description,
    has_parts: row.has_parts,
    availability: availability,
    parts: null,
  };

  return rentable;
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

// TODO FIX ERROR HANDLING

async function retrieveCreatedRentable(id: string) {
  const full_result = await db.query(
    `SELECT r.id, r.name, r.description, r.has_parts, a.id as availability_id, a.total, a.maintenance, a.broken
       FROM rentable r
       JOIN availability a ON r.availability_id = a.id
       WHERE r.id = $1`,
    [id]
  );

  if (!full_result.rows.length) {
    throw new Error("Failed to fetch availability for rentable");
  }

  return await formatRentableCreate(full_result.rows[0], null);
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
