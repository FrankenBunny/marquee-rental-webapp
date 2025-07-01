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
  await db.query("TRUNCATE TABLE item RESTART IDENTITY CASCADE");
});

const endpoint = "/api/inventory/item";

describe("itemRoutes /POST", () => {
  test("should create item and return 200 with valid input", async () => {
    const name = "testItem";
    const description = "Test description";

    const response = await request(app).post(endpoint).send({
      name: name,
      description: description,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.length).not.toBe(0);
    expect(response.body.name).toEqual(name);
    expect(response.body.description).toEqual(description);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("availability_id");
  });
});

describe("itemRoutes /GET", () => {
  test("should retrieve list of items after items are added", async () => {
    const name = "testItem";
    const description = "Test description";

    await request(app).post(endpoint).send({
      name: name,
      description: description,
    });

    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body[0].name).toEqual(name);
    expect(response.body[0].description).toEqual(description);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("availability_id");
  });

  test("should return 404 if no items exist", async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(404);
  });
});

describe("itemRoutes /GET/:id", () => {
  let testId: string;

  test("should retrieve item and return 200 with valid id", async () => {
    const name = "testItem";
    const description = "Test description";

    const item_post_response = await request(app).post(endpoint).send({
      name: name,
      description: description,
    });

    testId = item_post_response.body.id;

    const response = await request(app).get(`${endpoint}/${testId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body[0].name).toEqual(name);
    expect(response.body[0].description).toEqual(description);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("availability_id");
  });

  test("should return 404 if not found", async () => {
    const response = await request(app).get(`${endpoint}/${testId}`);
    expect(response.statusCode).toBe(404);
  });
});

describe.todo("itemRoutes NOT IMPLEMENTED /PUT/:id", () => {});

describe("itemRoutes /PATCH/:id", () => {
  let testId: string;

  test("should update item and return 200 with valid id and input", async () => {
    const name = "TestItem";
    const description = "Test description";

    const item_post_response = await request(app).post(endpoint).send({
      name: name,
      description: description,
    });

    testId = item_post_response.body.id;
    const updated_name = "updatedItem";
    const updated_description = "updated test description";

    const response = await request(app).patch(`${endpoint}/${testId}`).send({
      name: updated_name,
      description: updated_description,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body[0].name).toEqual(updated_name);
    expect(response.body[0].description).toEqual(updated_description);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("availability_id");
  });

  test("should return 404 with invalid id", async () => {
    const updated_name = "updatedItem";
    const updated_description = "updated test description";

    const response = await request(app).patch(`${endpoint}/${testId}`).send({
      name: updated_name,
      description: updated_description,
    });

    expect(response.statusCode).toBe(404);
  });
});

describe("itemRoutes /DELETE/id", () => {
  let testId;
  test("should delete item and return 200 with valid id", async () => {
    const name = "TestItem";
    const description = "Test description";

    const item_post_response = await request(app).post(endpoint).send({
      name: name,
      description: description,
    });

    testId = item_post_response.body.id;

    const response = await request(app).delete(`${endpoint}/${testId}`);

    expect(response.statusCode).toBe(200);
  });
});
