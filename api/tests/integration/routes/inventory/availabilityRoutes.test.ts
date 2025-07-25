import {
  beforeEach,
  afterAll,
  describe,
  expect,
  test,
  beforeAll,
} from "vitest";
import db from "../../../../src/db/client.js";
import app from "../../../../src/app.js";
import request from "supertest";

const endpoint = "/api/inventory/availability";
let testId: string;

beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  await db.query("TRUNCATE TABLE item RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await db.disconnect();
});

describe("availabilityRoutes /GET/:id", () => {
  test("should return 0 for all properties after initialization", async () => {
    const name = "TestItem";
    const description = "Test description";

    const item_post_response = await request(app)
      .post("/api/inventory/item")
      .send({
        name: name,
        description: description,
      });

    testId = item_post_response.body.availability_id;

    const response = await request(app).get(`${endpoint}/${testId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toEqual(0);
    expect(response.body.broken).toEqual(0);
    expect(response.body.maintenance).toEqual(0);
  });
});

describe("availabilityRoutes /PATCH/:id", () => {
  test("should update availability total and return 200 with valid id and input", async () => {
    const name = "TestItem";
    const description = "Test description";

    const item_post_response = await request(app)
      .post("/api/inventory/item")
      .send({
        name: name,
        description: description,
      });

    testId = item_post_response.body.availability_id;

    const total: number = 10;
    const maintenance: number = 2;
    const broken: number = 1;

    const response = await request(app).patch(`${endpoint}/${testId}`).send({
      total: total,
      maintenance: maintenance,
      broken: broken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body.total).toEqual(total);
    expect(response.body.maintenance).toEqual(maintenance);
    expect(response.body.broken).toEqual(broken);
  });
});
