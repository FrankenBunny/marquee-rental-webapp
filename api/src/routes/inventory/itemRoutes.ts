import express, { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import db from "../../db/client.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import { buildPatchQuery } from "../../services/patchQuery.js";

const router: Router = express.Router();

router.post(
  "/item",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    try {
      const result = await db.query(
        "INSERT INTO item (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      const appErr: AppError = new Error("Failed to create item");
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.get("/item", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query("SELECT * FROM item");
    if (result.rows.length === 0) {
      res.status(404).json({ error: "No items found" });
      return;
    }
    res.status(200).json(result.rows);
  } catch (error) {
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
      const result = await db.query("SELECT * FROM item WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "No item found with id: " + id });
        return;
      }
      res.status(200).json(result.rows);
    } catch (error) {
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
    const { name, description } = req.body;

    if (!id) {
      const err: AppError = new Error("Missing item ID");
      err.status = 400;
      next(err);
      res.status(400).json({ error: "No item ID provided" });
      return;
    }

    const updates = {
      name: name,
      description: description,
    };

    const patchQuery = await buildPatchQuery(id, updates, {
      tableName: "item",
      allowedFields: ["name", "description"],
      transformFields: async (field, value) => {
        return value;
      },
    });

    try {
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
      res.status(200).json(result.rows);
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
      res.status(200).json({ message: "Item deleted", user: result.rows[0] });
    } catch (error) {
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
