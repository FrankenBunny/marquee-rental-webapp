import express, { Router } from "express";
import * as RentableController from "../../controllers/inventory/rentable.controller.js";
/*
 * ROUTER CREATION
 */
const router: Router = express.Router();

router.get("/rentable", RentableController.getAllRentables);

router.get("/rentable/:id", RentableController.getRentableById);

router.post("/rentable", RentableController.createRentable);

router.patch("/rentable/:id", RentableController.updateRentable);

router.delete("/rentable/:id", RentableController.deleteRentable);

export default router;
