import type { Response, Request, NextFunction } from "express";
import * as AvailabilityService from "../../services/inventory/availability.service.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import {
  AvailabilitySchema,
  AvailabilityUpdateSchema,
} from "../../schemas/inventory/availability.schema.js";

export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  if (!id) {
    res
      .status(400)
      .json({ error: "Availability: Missing availability ID in params." });
    return;
  }

  try {
    const availabilityRows = await AvailabilityService.getAvailability(id);

    if (availabilityRows === undefined) {
      res.status(404).json("404: No availability exists with id: " + id);
      return;
    }

    const parsedAvailability = AvailabilitySchema.safeParse({
      id: availabilityRows.id,
      total: availabilityRows.total,
      maintenance: availabilityRows.maintenance,
      broken: availabilityRows.broken,
    });

    if (!parsedAvailability.success) {
      res.status(400).json({
        error:
          "AvailabilityController getAvailability: Validation failed when parsing request" +
          parsedAvailability.error,
      });
      return;
    }

    res.status(200).json(parsedAvailability.data);
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
  const id = req.params.id;

  if (!id) {
    res
      .status(400)
      .json({ error: "Availability: Missing availability ID in params." });

    return;
  }

  try {
    const preUpdateAvailability = await AvailabilityService.getAvailability(id);

    if (preUpdateAvailability === undefined) {
      res.status(404).json({ error: `Availability with id ${id} not found.` });
      return;
    }

    const parsedAvailabilityUpdate = AvailabilityUpdateSchema.safeParse({
      total: req.body.total,
      maintenance: req.body.maintenance,
      broken: req.body.broken,
    });

    if (!parsedAvailabilityUpdate.success) {
      res.status(400).json({
        error:
          "AvailabilityController updateAvailability: Validation failed when parsing request" +
          parsedAvailabilityUpdate.error,
      });
      return;
    }

    const updatedAvailabilityResult =
      await AvailabilityService.updateAvailability(
        parsedAvailabilityUpdate.data,
        id
      );

    res.status(200).json(updatedAvailabilityResult);
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
