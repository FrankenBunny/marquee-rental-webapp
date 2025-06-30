import { describe, test, expect } from "vitest";
import { buildPatchQuery } from "../../../src/services/patchQuery.js";

describe("patchHandler", () => {
  test("should build query with valid input", async () => {
    const id = "1";
    const updates = {
      username: "NEWUSER",
      name: "New Name",
    };

    const result = await buildPatchQuery(id, updates, {
      tableName: "app_user",
      allowedFields: ["username", "name", "email"],
      transformFields: async (field, value) => {
        return value;
      },
    });

    expect(result).not.toBe(null);
    expect(result!.query).toMatch(
      /UPDATE app_user SET username = \$1, name = \$2 WHERE id = \$3 RETURNING \*/
    );
    expect(result!.values).toEqual([updates.username, updates.name, "1"]);
  });

  test("should build query while transforming to lowercase with valid input", async () => {
    const id = "1";
    const updates = {
      username: "NEWUSER",
      name: "New Name",
    };

    const result = await buildPatchQuery(id, updates, {
      tableName: "app_user",
      allowedFields: ["username", "name", "email"],
      transformFields: async (field, value) => {
        if (field === "username" && typeof value === "string")
          return value.toLowerCase();
        if (field === "email" && typeof value === "string")
          return value.toLowerCase();
        return value;
      },
    });

    expect(result).not.toBe(null);
    expect(result!.query).toMatch(
      /UPDATE app_user SET username = \$1, name = \$2 WHERE id = \$3 RETURNING \*/
    );
    expect(result!.values).toEqual([
      updates.username.toLowerCase(),
      updates.name,
      "1",
    ]);
  });

  test("should ignore fields with undefined value", async () => {
    const id = "1";
    const updates = {
      username: "NEWUSER",
      name: "New Name",
      email: undefined,
    };

    const result = await buildPatchQuery(id, updates, {
      tableName: "app_user",
      allowedFields: ["username", "name", "email"],
      transformFields: async (field, value) => {
        if (field === "username" && typeof value === "string")
          return value.toLowerCase();
        return value;
      },
    });

    expect(result).not.toBe(null);
    expect(result!.query).toMatch(
      /UPDATE app_user SET username = \$1, name = \$2 WHERE id = \$3 RETURNING \*/
    );
    expect(result!.values).toEqual([
      updates.username.toLowerCase(),
      updates.name,
      "1",
    ]);
  });

  test("return null if no allowed field are provided", async () => {
    const id = "1";
    const updates = {};

    const result = await buildPatchQuery(id, updates, {
      tableName: "app_user",
      allowedFields: ["username", "name", "email"],
      transformFields: async (field, value) => {
        if (typeof value !== "string") {
          throw new Error(`Invalid type for field: ${field}`);
        }
        if (field === "username") return value.toLowerCase();
        return value;
      },
    });

    expect(result).toBe(null);
  });

  test("return null if non-allowed field are provided", async () => {
    const id = "1";
    const updates = {
      not_allowed: "not_allowed",
    };

    const result = await buildPatchQuery(id, updates, {
      tableName: "app_user",
      allowedFields: ["username", "name", "email"],
      transformFields: async (field, value) => {
        if (typeof value !== "string") {
          throw new Error(`Invalid type for field: ${field}`);
        }
        if (field === "username") return value.toLowerCase();
        if (field === "email") return value.toLowerCase();
        return value;
      },
    });

    expect(result).toBe(null);
  });
});
