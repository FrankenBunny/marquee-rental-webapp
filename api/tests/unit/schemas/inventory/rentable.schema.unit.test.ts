import { describe, test, expect } from "vitest";
import {
  Rentable,
  RentableCreate,
  RentableUpdate,
} from "../../../../src/schemas/inventory/rentable.schema.js";

describe("Rentable Schema", () => {
  test("should parse valid input for rentable w/o parts", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: false,
      parts: null,
    };

    const result = Rentable.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for rentable with non-interchangeable parts", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: true,
      parts: [
        {
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
        },
      ],
    };

    const result = Rentable.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for rentable with interchangeable parts", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: true,
      parts: [
        {
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
        },
      ],
    };

    const result = Rentable.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should not parse rentable w/o parts when has_parts === true", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: true,
      parts: null,
    };

    const result = Rentable.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("should not parse rentable with empty parts when has_parts === true", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      availability: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: true,
      parts: [],
    };

    const result = Rentable.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("RentableCreate Schema", () => {
  test("should parse valid input for rentable w/o parts", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      availability: {
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: false,
      parts: null,
    };

    const result = RentableCreate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for rentable with non-interchangeable parts", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      availability: {
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: true,
      parts: [
        {
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
        },
      ],
    };

    const result = RentableCreate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for rentable with interchangeable parts", async () => {
    const data = {
      name: "Test name",
      description: "Test description",
      availability: {
        total: 10,
        maintenance: 1,
        broken: 0,
      },
      has_parts: true,
      parts: [
        {
          name: "Test name",
          description: "Test description",
          interchangeable: true,
          quantity: 1,
          availability: null,
          rentable_id: "550e8400-e29b-41d4-a716-446655440000",
          variants: [
            {
              name: "TestPartVariant",
              description: "Test description.",
              availability: {
                total: 5,
                maintenance: 2,
                broken: 0,
              },
              part_id: "550e8400-e29b-41d4-a716-446655440000",
            },
          ],
        },
      ],
    };

    const result = RentableCreate.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe("RentableUpdate Schema", () => {
  test("should parse valid input for rentable w/o parts", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      has_parts: false,
      parts: null,
    };

    const result = RentableUpdate.safeParse(data);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for rentable with non-interchangeable parts", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      has_parts: true,
      parts: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Test name",
          description: "Test description",
          interchangeable: false,
          quantity: 1,
          rentable_id: "550e8400-e29b-41d4-a716-446655440000",
          variants: null,
        },
      ],
    };

    const result = RentableUpdate.safeParse(data);
    console.error(result.error);
    expect(result.success).toBe(true);
  });

  test("should parse valid input for rentable with interchangeable parts", async () => {
    const data = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test name",
      description: "Test description",
      has_parts: true,
      parts: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Test name",
          description: "Test description",
          interchangeable: true,
          quantity: 1,
          rentable_id: "550e8400-e29b-41d4-a716-446655440000",
          variants: [
            {
              id: "550e8400-e29b-41d4-a716-446655440000",
              name: "TestPartVariant",
              description: "Test description.",
              part_id: "550e8400-e29b-41d4-a716-446655440000",
            },
          ],
        },
      ],
    };

    const result = RentableUpdate.safeParse(data);
    expect(result.success).toBe(true);
  });
});
