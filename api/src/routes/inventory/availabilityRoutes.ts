import express, { Router } from "express";
import * as AvailabilityController from "../../controllers/inventory/availability.controller.js";

const router: Router = express.Router();

router.get("/availability/:id", AvailabilityController.getAvailability);

router.patch("/availability/:id", AvailabilityController.updateAvailability);

export default router;
