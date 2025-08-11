import express, { Router } from "express";
import * as RentableController from "../../controllers/inventory/rentable.controller.js";
import * as PartController from "../../controllers/inventory/part.controller.js";

const router: Router = express.Router();

// Rentable routes
router.get("/rentable", RentableController.getAllRentables);

router.get("/rentable/:id", RentableController.getRentableById);

router.post("/rentable", RentableController.createRentable);

router.patch("/rentable/:id", RentableController.updateRentable);

router.delete("/rentable/:id", RentableController.deleteRentable);

// Part routes
router.post("/rentable/part", PartController.createPart);

router.get("/rentable/part/:id", PartController.getPart);

router.patch("/rentable/part/:id", PartController.updatePart);

router.delete("/rentable/part/:id", PartController.deletePart);

export default router;
