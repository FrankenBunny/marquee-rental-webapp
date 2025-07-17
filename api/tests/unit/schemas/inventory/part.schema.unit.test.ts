import { describe, test, expect } from "vitest";
import {
  Part,
  PartCreate,
  PartUpdate,
} from "../../../../src/schemas/inventory/part.schema.js";

describe("Part Schema", () => {
  test("should parse valid input for non-interchangeable", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: false,
      quantity: 1,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      variants: null,
    };

    const result = Part.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for interchangeable", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
      availability: null,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
      variants: [
        {
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
        },
      ],
    };

    const result = Part.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should not parse non-interchangeable if missing availability", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: false,
      quantity: 1,
      availability: null,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = Part.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("should not parse interchangeable if availability is provided", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = Part.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("should not parse interchangeable if empty array", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
      availability: null,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
      variants: [],
    };

    const result = Part.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("PartCreate Schema", () => {
  test("should parse valid input for non-interchangeable", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      interchangeable: false,
      quantity: 1,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
      availability: {
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      variants: null,
    };

    const result = PartCreate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for interchangeable", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
      availability: null,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
      variants: [
        {
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
        },
      ],
    };

    const result = PartCreate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should not parse non-interchangeable if missing availability", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      interchangeable: false,
      quantity: 1,
      availability: null,
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartCreate.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("should not parse interchangeable if availability is provided", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
      availability: {
        total: 5,
        maintenance: 2,
        broken: 0,
      },
      rentable_id: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = PartCreate.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("PartUpdate Schema", () => {
  test("should parse valid input for interchangable", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: false,
      quantity: 1,
      variants: null,
    };

    const result = PartUpdate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for non-interchangable", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
      variants: [
        {
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
        },
      ],
    };

    const result = PartUpdate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should not parse if missing id", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      interchangeable: true,
      quantity: 1,
    };

    const result = PartUpdate.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("should not parse if missing updates", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: null,
      description: null,
      interchangeable: null,
      quantity: null,
    };

    const result = PartUpdate.safeParse(data);
    expect(result.success).toBe(false);
  });
});
