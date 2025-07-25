import express, { Router } from "express";
import * as RentableController from "../../controllers/inventory/rentable.controller.js";

/*
 * ROUTER CREATION
 */
const router: Router = express.Router();

router.get("/rentable", RentableController.getAllRentables);

router.post("/rentable", RentableController.createRentable);

export default router;
