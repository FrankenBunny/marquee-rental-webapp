import type { Response, Request, NextFunction } from "express";
import * as PartService from "../../services/inventory/part.service.js";
import * as RentableService from "../../services/inventory/rentable.service.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import {
  Rentable,
  RentableCreateRequest,
  RentableUpdate,
} from "../../schemas/inventory/rentable.schema.js";
import { Part, PartCreate } from "../../schemas/inventory/part.schema.js";

/**
 * Validate the POST request body and create a new Rentable
 *
 * @param req
 * @param res
 * @param next
 */
export async function createRentable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsedRequest = RentableCreateRequest.safeParse(req.body);

    if (!parsedRequest.success) {
      res.status(400).json({
        error:
          "RentableController createRentable: Validation failed when parsing request" +
          parsedRequest.error,
      });

      return;
    }

    const rentableCreateResult = await RentableService.createRentable(
      parsedRequest.data
    );

    const parsedParts = [];

    if (rentableCreateResult.has_parts && parsedRequest.data.parts != null) {
      const parts = parsedRequest.data.parts;
      for (const part of parts) {
        const parsedPartRequest = PartCreate.safeParse({
          name: part.name,
          description: part.description,
          quantity: part.quantity,
          rentable_id: rentableCreateResult.id,
          availability: part.availability,
        });

        if (!parsedPartRequest.success) {
          res.status(400).json({
            error:
              "RentableController createRentable: Validation failed when parsing parts for creation." +
              parsedPartRequest.error,
          });
          return;
        }

        const createdPart = await PartService.createPart(
          parsedPartRequest.data
        );

        const parsedPartResponse = Part.safeParse({
          id: createdPart.id,
          name: createdPart.name,
          description: createdPart.description,
          quantity: createdPart.quantity,
          rentable_id: createdPart.rentable_id,
          availability: createdPart.availability,
          variants: null,
        });

        if (!parsedPartResponse.success) {
          res.status(400).json({
            error:
              "RentableController createRentable: Validation failed when parsing parts response." +
              parsedPartResponse.error,
          });
          return;
        }

        parsedParts.push(parsedPartResponse.data);
      }
    }

    const rentableResult = Rentable.safeParse({
      id: rentableCreateResult.id,
      name: rentableCreateResult.name,
      description: rentableCreateResult.description,
      availability: rentableCreateResult.availability,
      has_parts: rentableCreateResult.has_parts,
      parts: parsedParts,
    });

    if (!rentableResult.success) {
      res.status(400).json({
        error:
          "RentableController createRentable: Validation failed when parsing complete result." +
          rentableResult.error,
      });
      return;
    }

    res.status(201).json(rentableResult.data);
  } catch (error) {
    const appErr: AppError = new Error(
      "RentableController.createRentable: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function getAllRentables(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rentables = await RentableService.getRentables();
    res.status(200).json(rentables);
  } catch (error) {
    const appErr: AppError = new Error(
      "RentableController getAllRentables: Failed to get rentables"
    );
    appErr.status = 500;
    appErr.cause = error;

    next(appErr);
  }
}

export async function getRentableById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Missing 'id' parameter" });
    return;
  }

  try {
    const rentable = await RentableService.getRentableById(id);

    if (rentable === undefined) {
      res.status(404).json("404: No rentable exists with id: " + id);
      return;
    }
    res.status(200).json(rentable);
  } catch (error) {
    const appErr: AppError = new Error(
      "RentableController.getRentableById: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function updateRentable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Missing 'id' parameter" });
    return;
  }

  try {
    const rentable = await RentableService.getRentableById(id);

    if (rentable === undefined) {
      res.status(404).json("404: No rentable exists with id: " + id);
      return;
    }

    const parsedRentableUpdate = RentableUpdate.safeParse({
      id: id,
      name: req.body.name ?? null,
      description: req.body.description ?? null,
      has_parts: req.body.has_parts ?? null,
      parts: req.body.parts ?? null,
      new_parts: req.body.new_parts ?? null,
      deleted_parts: req.body.deleted_parts ?? null,
    });

    if (!parsedRentableUpdate.success) {
      res.status(400).json({
        error:
          "RentableController updateRentable: Validation failed when parsing request" +
          parsedRentableUpdate.error,
      });
      return;
    }

    const updatedRentable = await RentableService.updateRentable(
      parsedRentableUpdate.data
    );

    res.status(200).json(updatedRentable);
  } catch (error) {
    const appErr: AppError = new Error(
      "RentableController updateRentable: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function deleteRentable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Missing 'id' parameter" });
    return;
  }

  try {
    const rentable = await RentableService.getRentableById(id);

    if (rentable === undefined) {
      res.status(404).json("404: No rentable exists with id: " + id);
      return;
    }

    await RentableService.deleteRentable(id);

    res.status(200).json("Successfully removed rentable");
  } catch (error) {
    const appErr: AppError = new Error(
      "RentableController deleteRentable: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}
