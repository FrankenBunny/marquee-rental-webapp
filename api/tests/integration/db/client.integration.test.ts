import { describe, expect, test } from "vitest";
import db from "../../../src/db/client.js";

describe("Database Connection", () => {
  test("should connect to database", async () => {
    await expect(db.connect()).resolves.not.toThrow();
  });

  test("should query database", async () => {
    await expect(db.query("SELECT * FROM app_user")).resolves.not.toThrow();
  });

  test("should disconnect from database", async () => {
    await expect(db.disconnect()).resolves.not.toThrow();
  });
});
