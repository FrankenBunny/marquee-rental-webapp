import type { Response, Request, NextFunction } from "express";
import { PartCreate, PartUpdate } from "../../schemas/inventory/part.schema.js";
import * as PartService from "../../services/inventory/part.service.js";
import type { AppError } from "../../middlewares/errorHandler.js";

export async function createPart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsedRequest = PartCreate.safeParse(req.body);

    if (!parsedRequest.success) {
      res.status(400).json({
        error:
          "PartController createPart: Validation failed when parsing request" +
          parsedRequest.error,
      });

      return;
    }

    const partCreateResult = await PartService.createPart(parsedRequest.data);

    res.status(201).json(partCreateResult);
  } catch (error) {
    const appErr: AppError = new Error(
      "PartController.createPart: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function getPart(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Missing 'id' parameter" });
    return;
  }

  try {
    const part = await PartService.getPartById(id);

    if (part === undefined) {
      res.status(404).json("404: No part exists with id: " + id);
      return;
    }

    res.status(200).json(part);
  } catch (error) {
    const appErr: AppError = new Error(
      "PartController getPart: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function updatePart(
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
    const part = await PartService.getPartById(id);

    if (part === undefined) {
      res.status(404).json("404: No part exists with id: " + id);
      return;
    }

    const parsedPartUpdate = PartUpdate.safeParse({
      id: id,
      name: req.body.name ?? null,
      description: req.body.description ?? null,
      quantity: req.body.quantity ?? null,
    });

    if (!parsedPartUpdate.success) {
      res.status(400).json({
        error:
          "PartController updatePart: Validation failed when parsing request" +
          parsedPartUpdate.error,
      });
      return;
    }

    const updatedPart = await PartService.updatePart(id, parsedPartUpdate.data);

    res.status(200).json(updatedPart);
  } catch (error) {
    const appErr: AppError = new Error(
      "PartController updatePart: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}

export async function deletePart(
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
    const part = await PartService.getPartById(id);

    if (part === undefined) {
      res.status(404).json("404: No part exists with id: " + id);
      return;
    }

    await PartService.deletePart(id);

    res.status(200).json("Successfully removed part");
  } catch (error) {
    const appErr: AppError = new Error(
      "PartController deletePart: Unexpected error"
    );
    appErr.status = 500;

    if (error instanceof Error) {
      appErr.cause = error;
    }

    next(appErr);
    return;
  }
}
