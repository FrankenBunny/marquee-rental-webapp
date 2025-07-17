import { describe, test, expect } from "vitest";
import {
  PartVariant,
  PartVariantCreate,
  PartVariantUpdate,
} from "../../../../src/schemas/inventory/partvariant.schema.js";

describe("PartVariant Schema", () => {
  test("Should parse valid input", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "TestPartVariant",
      description: "Test description.",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("Should parse without description", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "TestPartVariant",
      description: null,
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("Should not parse without name", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: null,
      description: "Test description.",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse if availability === null", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description.",
      availability: null,
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse without availability", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description.",
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse if part_id === null", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: null,
      description: "Test description.",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: null,
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse without part_id", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: null,
      description: "Test description.",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 5,
        maintenance: 2,
        broken: 0,
      },
    };

    const result = PartVariant.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("PartVariantCreate Schema", () => {
  test("Should parse valid input", async () => {
    const data = {
      name: "TestPartVariant",
      description: "Test description.",
      availability: {
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantCreate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("Should parse if description === null", async () => {
    const data = {
      name: "TestPartVariant",
      description: null,
      availability: {
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantCreate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("Should not parse if name === null", async () => {
    const data = {
      name: null,
      description: "Test description.",
      availability: {
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantCreate.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse without name", async () => {
    const data = {
      description: "Test description.",
      availability: {
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantCreate.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("PartVariantUpdate Schema", () => {
  test("Should parse valid input", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "TestPartVariant",
      description: "Test description.",
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantUpdate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("Should not parse if id === null", async () => {
    const data = {
      id: null,
      name: "TestPartVariant",
      description: "Test description.",
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantUpdate.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse if missing id", async () => {
    const data = {
      name: "TestPartVariant",
      description: "Test description.",
      part_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantUpdate.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse if name and description === null", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: null,
      description: null,
    };

    const result = PartVariantUpdate.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("Should not parse if missing both name and description", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartVariantUpdate.safeParse(data);
    expect(result.success).toBe(false);
  });
});
