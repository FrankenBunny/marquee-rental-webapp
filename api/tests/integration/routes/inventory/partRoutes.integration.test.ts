import { beforeEach, afterEach, describe, expect, test } from "vitest";
import db from "../../../../src/db/client.js";
import app from "../../../../src/app.js";
import request from "supertest";

beforeEach(async () => {
  await db.query("BEGIN");
});

afterEach(async () => {
  await db.query("ROLLBACK");
});

const endpoint = "/api/inventory/rentable/part";

describe("partRoutes /POST", () => {
  test("should create part without availability and return 201 with valid input", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: false,
        parts: null,
      });

    const name = "TestPart /POST";
    const description = "Test description.";
    const testId = rentable_result.body.id;

    const result = await request(app).post(endpoint).send({
      name: name,
      description: description,
      quantity: 5,
      availability: null,
      rentable_id: testId,
    });

    expect(result.statusCode).toBe(201);
    expect(result.statusCode).toBe(201);
    expect(result.body.name).toBe(name);
    expect(result.body.description).toBe(description);
    expect(result.body.quantity).toBe(5);
    expect(result.body.availability.total).toBe(0);
    expect(result.body.availability.maintenance).toBe(0);
    expect(result.body.availability.broken).toBe(0);
  });

  test("should create part with availability and return 201 with valid input", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: false,
        parts: null,
      });

    const name = "TestPart /POST";
    const description = "Test description.";
    const testId = rentable_result.body.id;

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        quantity: 5,
        availability: {
          total: 10,
          maintenance: 2,
          broken: 1,
        },
        rentable_id: testId,
      });

    expect(result.statusCode).toBe(201);
    expect(result.body.name).toBe(name);
    expect(result.body.description).toBe(description);
    expect(result.body.quantity).toBe(5);
    expect(result.body.availability.total).toBe(10);
    expect(result.body.availability.maintenance).toBe(2);
    expect(result.body.availability.broken).toBe(1);
  });
});

describe("PartRoutes /GET/:id", () => {
  test("should return 404 if not found", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).get(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 200 if found", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const testId = rentable_result.body.parts[0].id;
    const result = await request(app).get(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(200);
    expect(result.body.name).toBe("test");
    expect(result.body.description).toBe(null);
    expect(result.body.quantity).toEqual(5);
  });
});

describe("PartRoutes /DELETE", () => {
  test("should return 404 if not found", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).delete(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 200 and remove part if valid input", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const testId = rentable_result.body.parts[0].id;
    const result = await request(app).delete(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(200);
  });

  test("should return update rentable if not parts", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const rentable_testId = rentable_result.body.id;
    const part_testId = rentable_result.body.parts[0].id;
    await request(app).delete(`${endpoint}/${part_testId}`);

    const result = await request(app).get(
      `/api/inventory/rentable/${rentable_testId}`
    );

    expect(result.statusCode).toBe(200);
    expect(result.body.has_parts).toBe(false);
  });
});

describe("PartRoutes /PATCH", () => {
  test("should return 404 if not found", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).patch(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 404 if not found", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).patch(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 400 if no updates", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const testId = rentable_result.body.parts[0].id;
    const result = await request(app).patch(`${endpoint}/${testId}`).send({
      id: testId,
      name: null,
      description: null,
    });

    expect(result.statusCode).toBe(400);
  });

  test("should return 200 if updating name", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const testId = rentable_result.body.parts[0].id;
    const result = await request(app).patch(`${endpoint}/${testId}`).send({
      id: testId,
      name: "updated",
      description: null,
      quantity: null,
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.name).toBe("updated");
  });

  test("should return 200 if updating description", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const testId = rentable_result.body.parts[0].id;
    const result = await request(app).patch(`${endpoint}/${testId}`).send({
      id: testId,
      name: null,
      description: "updated",
      quantity: null,
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.description).toBe("updated");
  });

  test("should return 200 if updating quantity", async () => {
    const rentable_name = "TestRentable /POST";
    const rentable_description = "Test description.";

    const rentable_result = await request(app)
      .post("/api/inventory/rentable")
      .send({
        name: rentable_name,
        description: rentable_description,
        availability: null,
        has_parts: true,
        parts: [
          {
            name: "test",
            description: null,
            quantity: 5,
            availability: null,
          },
        ],
      });

    const testId = rentable_result.body.parts[0].id;
    const result = await request(app).patch(`${endpoint}/${testId}`).send({
      id: testId,
      name: null,
      description: null,
      quantity: 10,
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.quantity).toBe(10);
  });
});
