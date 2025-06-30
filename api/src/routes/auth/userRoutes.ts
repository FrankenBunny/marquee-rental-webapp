import express, { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import db from "../../db/client.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import { buildPatchQuery } from "../../services/patchQuery.js";

const router: Router = express.Router();

router.post(
  "/user",
  async (req: Request, res: Response, next: NextFunction) => {
    let { username, email } = req.body;
    const { name, password } = req.body;

    username = username.toLowerCase();
    email = email.toLowerCase();

    //TODO Hash password
    const password_hash = password;

    try {
      const result = await db.query(
        "INSERT INTO app_user (username, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, name, email, password_hash]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      const appErr: AppError = new Error("Failed to fetch users");
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.get("/user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query("SELECT * FROM app_user");
    res.status(200).json(result.rows);
  } catch (error) {
    const appErr: AppError = new Error("Failed to fetch users");
    appErr.status = 500;
    appErr.cause = error;
    next(appErr);
  }
});

router.get(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const result = await db.query("SELECT * FROM app_user WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json(result.rows);
    } catch (error) {
      const appErr: AppError = new Error(
        "Failed to fetch user with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.put(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, password } = req.body;
    let { username, email } = req.body;

    //TODO Hash password
    const password_hash = password;

    username = username.toLowerCase();
    email = email.toLowerCase();

    try {
      const result = await db.query(
        "UPDATE app_user SET username = $1, name = $2, email = $3, password_hash = $4 WHERE id = $5 RETURNING *",
        [username, name, email, password_hash, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json(result.rows);
    } catch (error) {
      const appErr: AppError = new Error(
        "Failed to update (PUT) user with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.patch(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { given_name, given_password, given_username, given_email } =
      req.body;

    if (!id) {
      const err: AppError = new Error("Missing user ID");
      err.status = 400;
      return next(err);
    }

    const updates = {
      username: given_username,
      name: given_name,
      password_hash: given_password,
      email: given_email,
    };

    const patchQuery = await buildPatchQuery(id, updates, {
      tableName: "app_user",
      allowedFields: ["username", "name", "email", "password_hash"],
      transformFields: async (field, value) => {
        if (field === "username" && typeof value === "string")
          return value.toLowerCase();
        if (field === "email" && typeof value === "string")
          return value.toLowerCase();
        if (field === "password_hash" && typeof value === "string")
          return value; //TODO Hash password;
        return value;
      },
    });

    try {
      if (!patchQuery) {
        res
          .status(400)
          .json({ error: "No valid field provided for api/user PATCH" });
        return;
      }

      const result = await db.query(patchQuery.query, patchQuery.values);

      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json(result.rows);
    } catch (error) {
      const appErr: AppError = new Error(
        "Failed to update (PATCH) user with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

router.delete(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await db.query(
        "DELETE FROM app_user WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json({ message: "User deleted", user: result.rows[0] });
    } catch (error) {
      const appErr: AppError = new Error(
        "Failed to delete user with given id: " + id
      );
      appErr.status = 500;
      appErr.cause = error;
      next(appErr);
    }
  }
);

export default router;
