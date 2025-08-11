import { beforeEach, afterEach, describe, expect, test } from "vitest";
import db from "../../../../src/db/client.js";
import app from "../../../../src/app.js";
import request from "supertest";

const endpoint = "/api/inventory/availability";
let testId: string;

beforeEach(async () => {
  await db.query("BEGIN");
});

afterEach(async () => {
  await db.query("ROLLBACK");
});

describe("availabilityRoutes /GET/:id", () => {
  test("should return 0 for all properties after initialization", async () => {
    const name = "TestItem";
    const description = "Test description";

    const rentable_post_response = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: null,
        parts: null,
      });

    testId = rentable_post_response.body.availability.id;

    expect(rentable_post_response.statusCode).toBe(201);

    const response = await request(app).get(`${endpoint}/${testId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toEqual(0);
    expect(response.body.broken).toEqual(0);
    expect(response.body.maintenance).toEqual(0);
  });

  test("should return custome values for all properties after initialization", async () => {
    const name = "TestItem";
    const description = "Test description";

    const rentable_post_response = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 5,
          maintenance: 1,
          broken: 1,
        },
        parts: null,
      });

    testId = rentable_post_response.body.availability.id;

    expect(rentable_post_response.statusCode).toBe(201);

    const response = await request(app).get(`${endpoint}/${testId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toEqual(5);
    expect(response.body.broken).toEqual(1);
    expect(response.body.maintenance).toEqual(1);
  });
});

describe("availabilityRoutes /PATCH/:id", () => {
  test("should update availability total and return 200 with valid id and input", async () => {
    const name = "TestItem";
    const description = "Test description";

    const rentable_post_response = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: null,
        parts: null,
      });

    testId = rentable_post_response.body.availability.id;

    const response = await request(app).patch(`${endpoint}/${testId}`).send({
      total: 10,
      maintenance: null,
      broken: null,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body.total).toEqual(10);
    expect(response.body.maintenance).toEqual(0);
    expect(response.body.broken).toEqual(0);
  });

  test("should update availability maintenance and return 200 with valid id and input", async () => {
    const name = "TestItem";
    const description = "Test description";

    const rentable_post_response = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 10,
          maintenance: 0,
          broken: 0,
        },
        parts: null,
      });

    testId = rentable_post_response.body.availability.id;

    const response = await request(app).patch(`${endpoint}/${testId}`).send({
      total: null,
      maintenance: 5,
      broken: null,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body.total).toEqual(10);
    expect(response.body.maintenance).toEqual(5);
    expect(response.body.broken).toEqual(0);
  });

  test("should update availability broken and return 200 with valid id and input", async () => {
    const name = "TestItem";
    const description = "Test description";

    const rentable_post_response = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {
          total: 10,
          maintenance: 0,
          broken: 0,
        },
        parts: null,
      });

    testId = rentable_post_response.body.availability.id;

    const response = await request(app).patch(`${endpoint}/${testId}`).send({
      total: null,
      maintenance: null,
      broken: 5,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body.total).toEqual(10);
    expect(response.body.maintenance).toEqual(0);
    expect(response.body.broken).toEqual(5);
  });
});
