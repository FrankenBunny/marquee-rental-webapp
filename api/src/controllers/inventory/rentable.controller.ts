import type { Response, Request, NextFunction } from "express";
//import * as AvailabilityService from "../../services/inventory/availability.service.js";
import * as PartService from "../../services/inventory/part.service.js";
import * as RentableService from "../../services/inventory/rentable.service.js";
import type { AppError } from "../../middlewares/errorHandler.js";
import z from "zod";
import {
  Rentable,
  RentableCreateRequest,
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
          interchangeable: false,
          quantity: part.quantity,
          rentable_id: rentableCreateResult.id,
          variants: null,
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
          interchangeable: createdPart.interchangeable,
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
    const rentables = RentableService.getRentables();
    res.status(200).json(rentables);
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
