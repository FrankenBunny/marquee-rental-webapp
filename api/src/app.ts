import express from "express";
import userRouter from "./routes/auth/userRoutes.js";
import itemRoutes from "./routes/inventory/itemRoutes.js";
import rentableRoutes from "./routes/inventory/rentableRoutes.js";
import availabilityRoutes from "./routes/inventory/availabilityRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";

const app = express();
/*
 * -- Middlewares --
 *
 * - JSON Formatting
 */
app.use(express.json());

app.use(corsMiddleware);

/*
 * -- Routes --
 *
 * Authentication & Authorization
 * - userRoutes
 *     Complete CRUID for user management.
 *
 * Inventory Management System
 * - rentableroutes
 *     Complete CRUD for rentable management.
 */
app.use("/api", userRouter);

app.use("/api/inventory/", itemRoutes);

app.use("/api/inventory", availabilityRoutes);

app.use("/api/inventory", rentableRoutes);

app.use(errorHandler);

export default app;
