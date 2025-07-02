import express, { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import db from "../../db/client.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import { buildPatchQuery } from "../../services/patchQuery.js";
import {
  ItemCreateSchema,
  ItemSchema,
  ItemUpdateSchema,
  ItemWithAvailabilitySchema,
} from "../../schemas/inventory/item.schema.js";
import { z } from "zod";

const router: Router = express.Router();

router.post(
  "/item",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = ItemCreateSchema.parse(req.body);
      const result = await db.query(
        "INSERT INTO item (name, description) VALUES ($1, $2) RETURNING *",
        [parsedBody.name, parsedBody.description ?? null]
      );

      const parsedItem = ItemSchema.parse(result.rows[0]);
      res.status(201).json(parsedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
        return;
      }
      const appErr: AppError = new Error("Failed to create item");
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.get("/item", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(`
        SELECT 
        item.id,
        item.name,
        item.description,
        json_build_object(
            'id', availability.id,
            'total', availability.total,
            'maintenance', availability.maintenance,
            'broken', availability.broken
        ) AS availability
        FROM item
        LEFT JOIN availability 
        ON availability.id = item.availability_id;
`);
    if (result.rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    const parsedItems = z.array(ItemWithAvailabilitySchema).parse(result.rows);

    res.status(200).json(parsedItems);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
      return;
    }
    const appErr: AppError = new Error("Failed to fetch items");
    appErr.status = 500;
    appErr.cause = error;
    next(appErr);
  }
});

router.get(
  "/item/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await db.query(
        `
        SELECT 
        item.id,
        item.name,
        item.description,
        json_build_object(
            'id', availability.id,
            'total', availability.total,
            'maintenance', availability.maintenance,
            'broken', availability.broken
        ) AS availability
        FROM item
        LEFT JOIN availability 
        ON availability.id = item.availability_id
        WHERE item.id = $1;`,
        [id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "No item found with id: " + id });
        return;
      } else if (result.rows.length !== 1) {
        res.status(500).json({ error: "Multiple items found with id: " + id });
        return;
      }

      const parsedItem = ItemWithAvailabilitySchema.parse(result.rows[0]);
      res.status(200).json(parsedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
        return;
      }
      const appErr: AppError = new Error("Failed to fetch item with id: " + id);
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.patch(
  "/item/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      const err: AppError = new Error("Missing item ID");
      err.status = 400;
      next(err);
      res.status(400).json({ error: "No item ID provided" });
      return;
    }

    try {
      const parsedBody = ItemUpdateSchema.parse(req.body);

      const updates = {
        name: parsedBody.name,
        description: parsedBody.description,
      };

      const patchQuery = await buildPatchQuery(id, updates, {
        tableName: "item",
        allowedFields: ["name", "description"],
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
      }

      const parsedItem = ItemSchema.parse(result.rows[0]);

      res.status(200).json(parsedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
        return;
      }
      const appErr: AppError = new Error(
        "Failed to update (PATCH) item with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.delete(
  "/item/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await db.query(
        "DELETE FROM item WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Item not found with id:" + id });
        return;
      }
      const parsedItem = ItemSchema.parse(result.rows[0]);

      res.status(200).json({ message: "Item deleted", user: parsedItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
        return;
      }
      const appErr: AppError = new Error(
        "Failed to delete item with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

export default router;
