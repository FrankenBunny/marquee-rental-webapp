import type { Response, Request, NextFunction } from "express";
import * as AvailabilityService from "../../services/inventory/availability.service.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import {
  AvailabilitySchema,
  AvailabilityUpdateSchema,
} from "../../schemas/inventory/availability.schema.js";
import z from "zod";

export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (!id) {
      res
        .status(400)
        .json({ error: "Availability: Missing availability ID in params." });
      return;
    }

    const result = await AvailabilityService.getAvailability(id);
    const parsedResult = AvailabilitySchema.safeParse(result.rows[0]);

    if (!parsedResult.success) {
      res.status(400).json({
        error:
          "AvailabilityController getAvailability: Validation failed when parsing result",
      });
      return;
    }

    res.status(200).json(parsedResult.data);
  } catch (error) {
    const appErr: AppError = new Error(
      "AvailabilityController getAvailability: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function updateAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (!id) {
      res
        .status(400)
        .json({ error: "Availability: Missing availability ID in params." });

      return;
    }

    const preUpdateAvailabilityResult =
      await AvailabilityService.getAvailability(id);

    if (
      !preUpdateAvailabilityResult ||
      preUpdateAvailabilityResult.rows.length === 0
    ) {
      res.status(404).json({ error: `Availability with id ${id} not found.` });
      return;
    }

    const parsedAvailabilityUpdate: z.infer<typeof AvailabilityUpdateSchema> = {
      total: req.body.total,
      maintenance: req.body.maintenance,
      broken: req.body.broken,
    };

    const updatedAvailabilityresult =
      await AvailabilityService.updateAvailability(
        parsedAvailabilityUpdate,
        id
      );

    const parsedAvailabilityResult = AvailabilitySchema.safeParse(
      updatedAvailabilityresult
    );

    if (!parsedAvailabilityResult.success) {
      res.status(400).json({
        error:
          "AvailabilityController updateAvailability: Validation failed when parsing availability result",
      });

      return;
    }

    res.status(200).json(parsedAvailabilityResult);
  } catch (error) {
    const appErr: AppError = new Error(
      "AvailabilityController updateAvailability: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}
