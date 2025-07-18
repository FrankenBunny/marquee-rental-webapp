import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import db from "../../../../src/db/client.js";
import app from "../../../../src/app.js";
import request from "supertest";

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.disconnect();
});

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
      has_parts: false,
      availability: {},
      parts: null,
    });

    expect(result.statusCode).toBe(201);
  });

  test("should create rentable without parts/availability and return rentable json with valid input", async () => {
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
      availability: {},
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

  test("should create rentable with non-interchaneable part and return 201 with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const result = await request(app)
      .post(endpoint)
      .send({
        name: name,
        description: description,
        has_parts: false,
        availability: {},
        parts: [
          {
            name: part_name,
            description: description,
            quantity: 4,
          },
        ],
      });

    expect(result.statusCode).toBe(201);
  });
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

describe.todo("rentableRoutes /GET", () => {
  test("shoudl return 404 if not found", async () => {
    const result = await request(app).get(endpoint);

    expect(result.statusCode).toBe(404);
  });
});
