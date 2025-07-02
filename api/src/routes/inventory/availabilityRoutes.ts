import express, { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import db from "../../db/client.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import { buildPatchQuery } from "../../services/patchQuery.js";
import {
  AvailabilitySchema,
  AvailabilityUpdateSchema,
} from "../../schemas/inventory/availability.schema.js";
import { z } from "zod";

const router: Router = express.Router();

router.get(
  "/availability/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const result = await db.query(
        "SELECT * FROM availability WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Availability not found" });
        return;
      } else if (result.rows.length !== 1) {
        res.status(500).json({ error: "Multiple availability found" });
        return;
      }

      const parsedItem = AvailabilitySchema.parse(result.rows[0]);

      res.status(200).json(parsedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
        return;
      }

      const appErr: AppError = new Error(
        "Failed to fetch availability with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.patch(
  "/availability/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      const err: AppError = new Error("Missing availability ID");
      err.status = 400;
      next(err);
      res.status(400).json({ error: "No availability ID provided" });
      return;
    }
    try {
      const parsedBody = AvailabilityUpdateSchema.parse(req.body);

      const updates = {
        total: parsedBody.total,
        maintenance: parsedBody.maintenance,
        broken: parsedBody.broken,
      };

      const patchQuery = await buildPatchQuery(id, updates, {
        tableName: "availability",
        allowedFields: ["total", "maintenance", "broken"],
        transformFields: async (field, value) => {
          return value;
        },
      });

      if (!patchQuery) {
        res.status(400).json({
          error: "No valid field provided for api/inventory/item PATCH",
        });
        return;
      }

      const result = await db.query(patchQuery.query, patchQuery.values);

      if (result.rows.length === 0) {
        res.status(404).json({ error: "Item not found" });
        return;
      } else if (result.rows.length !== 1) {
        res.status(500).json({ error: "Multiple availability found" });
        return;
      }

      const parsedItem = AvailabilitySchema.parse(result.rows[0]);
      res.status(200).json(parsedItem);
    } catch (error) {
      const appErr: AppError = new Error(
        "Failed to update (PATCH) item with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

export default router;
