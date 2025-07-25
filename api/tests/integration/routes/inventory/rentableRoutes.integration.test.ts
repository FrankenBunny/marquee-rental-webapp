import { beforeEach, describe, expect, test } from "vitest";
import db from "../../../../src/db/client.js";
import app from "../../../../src/app.js";
import request from "supertest";

beforeEach(async () => {
  await db.query("TRUNCATE TABLE rentable RESTART IDENTITY CASCADE");
});

const endpoint = "/api/inventory/rentable";

describe("rentableRoutes /POST", () => {
  test("should create rentable without parts/availability and return 201 with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app).post(endpoint).send({
      name: name,
      description: description,
      availability: null,
      has_parts: false,
      parts: null,
    });

    expect(result.statusCode).toBe(201);
  });

  test("should create rentable without parts, empty availability and return 201 with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app).post(endpoint).send({
      name: name,
      description: description,
      has_parts: false,
      availability: {},
      parts: null,
    });

    expect(result.statusCode).toBe(201);
  });

  test("should not create rentable missing properties and return 400 with valid input", async () => {
    const description = "Test description.";

    const result = await request(app).post(endpoint).send({
      description: description,
      has_parts: false,
      availability: {},
      parts: null,
    });

    expect(result.statusCode).toBe(400);
  });

  test("should create rentable without parts/availability and return rentable json with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app).post(endpoint).send({
      name: name,
      description: description,
      has_parts: false,
      availability: null,
      parts: null,
    });

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("id");
    expect(result.body).toHaveProperty("name");
    expect(result.body).toHaveProperty("description");
    expect(result.body).toHaveProperty("has_parts");
    expect(result.body).toHaveProperty("availability");
    expect(result.body.availability).toHaveProperty("id");
    expect(result.body.availability).toHaveProperty("total");
    expect(result.body.availability).toHaveProperty("maintenance");
    expect(result.body.availability).toHaveProperty("broken");
  });

  test("should create rentable without parts/availability and return rentable json with correct values with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app).post(endpoint).send({
      name: name,
      description: description,
      has_parts: false,
      availability: null,
      parts: null,
    });

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("id");
    expect(result.body.name).toBe(name);
    expect(result.body.description).toBe(description);
    expect(result.body.has_parts).toBe(false);
    expect(result.body).toHaveProperty("availability");
    expect(result.body.availability).toHaveProperty("id");
    expect(result.body.availability.total).toEqual(0);
    expect(result.body.availability.maintenance).toEqual(0);
    expect(result.body.availability.broken).toEqual(0);
  });

  test("should create rentable with complete availability and without parts and return 201 with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 10,
          maintenance: 2,
          broken: 0,
        },
        parts: null,
      });

    expect(result.statusCode).toBe(201);
  });

  test("should create rentable with complete availability and w/o parts and return rentable json with correct values with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 10,
          maintenance: 2,
          broken: 1,
        },
        parts: null,
      });

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("id");
    expect(result.body.name).toBe(name);
    expect(result.body.description).toBe(description);
    expect(result.body.has_parts).toBe(false);
    expect(result.body).toHaveProperty("availability");
    expect(result.body.availability).toHaveProperty("id");
    expect(result.body.availability.total).toEqual(10);
    expect(result.body.availability.maintenance).toEqual(2);
    expect(result.body.availability.broken).toEqual(1);
  });

  test("should create rentable with partial availability and without parts and return 201 with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 10,
        },
        parts: null,
      });

    expect(result.statusCode).toBe(201);
  });

  test("should create rentable with partial availability and without parts and return 201 with correct values with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 10,
        },
        parts: null,
      });

    expect(result.statusCode).toBe(201);
    expect(result.body.availability.total).toBe(10);
    expect(result.body.availability.maintenance).toBe(0);
    expect(result.body.availability.broken).toBe(0);
  });

  test("should create rentable with non-interchangeable part and return 201 with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: true,
        availability: null,
        parts: [
          {
            name: part_name,
            description: description,
            quantity: 4,
            interchangeable: false,
            variants: null,
            availability: null,
          },
        ],
      });

    expect(result.statusCode).toBe(201);
  });

  test("should create rentable with non-interchangeable part and return rentable json including part with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: true,
        availability: null,
        parts: [
          {
            name: part_name,
            description: description,
            quantity: 4,
            interchangeable: false,
            variants: null,
            availability: null,
          },
        ],
      });

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("parts");
    expect(result.body.parts[0]).toHaveProperty("id");
    expect(result.body.parts[0]).toHaveProperty("name");
    expect(result.body.parts[0]).toHaveProperty("description");
    expect(result.body.parts[0]).toHaveProperty("interchangeable");
    expect(result.body.parts[0]).toHaveProperty("quantity");
    expect(result.body.parts[0]).toHaveProperty("rentable_id");
    expect(result.body.parts[0]).toHaveProperty("availability");
    expect(result.body.parts[0].availability).toHaveProperty("id");
    expect(result.body.parts[0].availability).toHaveProperty("total");
    expect(result.body.parts[0].availability).toHaveProperty("maintenance");
    expect(result.body.parts[0].availability).toHaveProperty("broken");
  });
});

describe("rentableRoutes /GET", () => {
  test("shoudl return 200 if no rentables exist", async () => {
    const result = await request(app).get(endpoint);

    expect(result.statusCode).toBe(200);
  });
});
