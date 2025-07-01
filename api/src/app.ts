import express from "express";
import userRouter from "./routes/auth/userRoutes.js";
import itemRoutes from "./routes/inventory/itemRoutes.js";
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

app.use(errorHandler);

export default app;
