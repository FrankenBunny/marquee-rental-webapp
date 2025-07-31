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

  test("should create rentable with part and return 201 with valid input", async () => {
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
            availability: null,
          },
        ],
      });

    expect(result.statusCode).toBe(201);
  });

  test("should create rentable with part and return rentable json including part with valid input", async () => {
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
            availability: null,
          },
        ],
      });

    expect(result.statusCode).toBe(201);
    expect(result.body.name).toBe(name);
    expect(result.body.description).toBe(description);
    expect(result.body.has_parts).toEqual(true);
    expect(result.body).toHaveProperty("parts");
    expect(result.body.parts[0]).toHaveProperty("id");
    expect(result.body.parts[0]).toHaveProperty("name");
    expect(result.body.parts[0]).toHaveProperty("description");
    expect(result.body.parts[0]).toHaveProperty("quantity");
    expect(result.body.parts[0]).toHaveProperty("rentable_id");
    expect(result.body.parts[0]).toHaveProperty("availability");
    expect(result.body.parts[0].availability).toHaveProperty("id");
    expect(result.body.parts[0].availability).toHaveProperty("total");
    expect(result.body.parts[0].availability).toHaveProperty("maintenance");
    expect(result.body.parts[0].availability).toHaveProperty("broken");
  });

  test("should create rentable with part and return rentable json including part with correct values with valid input", async () => {
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
            availability: null,
          },
        ],
      });

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("parts");
    expect(result.body.parts[0]).toHaveProperty("id");
    expect(result.body.parts[0].name).toBe(part_name);
    expect(result.body.parts[0].description).toBe(description);
    expect(result.body.parts[0].quantity).toEqual(4);
    expect(result.body.parts[0]).toHaveProperty("rentable_id");
    expect(result.body.parts[0]).toHaveProperty("availability");
    expect(result.body.parts[0].availability).toHaveProperty("id");
    expect(result.body.parts[0].availability.total).toEqual(0);
    expect(result.body.parts[0].availability.maintenance).toEqual(0);
    expect(result.body.parts[0].availability.broken).toEqual(0);
  });

  test("should create rentable with part w availability and return rentable json including part with correct values with valid input", async () => {
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
            availability: {
              total: 10,
              maintenance: 2,
              broken: 1,
            },
          },
        ],
      });

    expect(result.statusCode).toBe(201);
    expect(result.body).toHaveProperty("parts");
    expect(result.body.parts[0]).toHaveProperty("id");
    expect(result.body.parts[0].name).toBe(part_name);
    expect(result.body.parts[0].description).toBe(description);
    expect(result.body.parts[0].quantity).toEqual(4);
    expect(result.body.parts[0]).toHaveProperty("rentable_id");
    expect(result.body.parts[0]).toHaveProperty("availability");
    expect(result.body.parts[0].availability).toHaveProperty("id");
    expect(result.body.parts[0].availability.total).toEqual(10);
    expect(result.body.parts[0].availability.maintenance).toEqual(2);
    expect(result.body.parts[0].availability.broken).toEqual(1);
  });
});

describe("rentableRoutes /GET", () => {
  test("should return 200 if no rentables exist", async () => {
    const result = await request(app).get(endpoint);

    expect(result.statusCode).toBe(200);
  });

  test("should return 200 and rentable if exists", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    await request(app)
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
            availability: null,
          },
        ],
      });

    const result = await request(app).get(endpoint);

    expect(result.statusCode).toBe(200);
    expect(result.body[0]).toHaveProperty("name");
    expect(result.body[0]).toHaveProperty("description");
    expect(result.body[0]).toHaveProperty("has_parts");
    expect(result.body[0]).toHaveProperty("parts");
    expect(result.body[0].parts[0]).toHaveProperty("id");
    expect(result.body[0].parts[0].name).toBe(part_name);
    expect(result.body[0].parts[0].description).toBe(description);
    expect(result.body[0].parts[0].quantity).toEqual(4);
    expect(result.body[0].parts[0]).toHaveProperty("rentable_id");
    expect(result.body[0].parts[0]).toHaveProperty("availability");
    expect(result.body[0].parts[0].availability).toHaveProperty("id");
    expect(result.body[0].parts[0].availability.total).toEqual(0);
    expect(result.body[0].parts[0].availability.maintenance).toEqual(0);
    expect(result.body[0].parts[0].availability.broken).toEqual(0);
  });
});

describe("rentableRoutes /GET:id", () => {
  test("should return 404 if no rentable with id exists", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).get(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 200 and rentable if exists", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const post_result = await request(app)
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
            availability: null,
          },
        ],
      });

    const testId = post_result.body.id;
    const result = await request(app).get(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("name");
    expect(result.body).toHaveProperty("description");
    expect(result.body).toHaveProperty("has_parts");
    expect(result.body).toHaveProperty("parts");
    expect(result.body.parts[0]).toHaveProperty("id");
    expect(result.body.parts[0].name).toBe(part_name);
    expect(result.body.parts[0].description).toBe(description);
    expect(result.body.parts[0].quantity).toEqual(4);
    expect(result.body.parts[0]).toHaveProperty("rentable_id");
    expect(result.body.parts[0]).toHaveProperty("availability");
    expect(result.body.parts[0].availability).toHaveProperty("id");
    expect(result.body.parts[0].availability.total).toEqual(0);
    expect(result.body.parts[0].availability.maintenance).toEqual(0);
    expect(result.body.parts[0].availability.broken).toEqual(0);
  });
});

describe("rentableRoutes /PATCH/:id", () => {
  test("should return 404 if no rentable with id exists", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).patch(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 400 if missing changes", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).patch(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 200 if removing parts with valid input", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const post_result = await request(app)
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
            availability: null,
          },
        ],
      });

    const testId = post_result.body.id;
    const partId = post_result.body.parts[0].id;

    const result = await request(app)
      .patch(`${endpoint}/${testId}`)
      .send({
        name: null,
        description: null,
        has_parts: false,
        parts: null,
        deleted_parts: [partId],
        new_parts: null,
      });

    expect(result.statusCode).toBe(200);
    expect(result.body.parts === null || result.body.parts === undefined).toBe(
      true
    );
  });

  test.todo(
    "should return 200 if adding new parts with valid input",
    async () => {
      const name = "TestRentable /POST";
      const description = "Test description.";
      const part_name = "TestPart /POST";

      const post_result = await request(app)
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
              availability: null,
            },
          ],
        });

      const testId = post_result.body.id;

      const result = await request(app)
        .patch(`${endpoint}/${testId}`)
        .send({
          id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
          name: null,
          description: null,
          has_parts: null,
          parts: null,
          deleted_parts: null,
          new_parts: [
            {
              name: part_name + "123",
              description: description,
              quantity: 4,
              availability: null,
              rentable_id: testId,
            },
          ],
        });

      console.error(result.body);
      expect(result.statusCode).toBe(200);
      expect(Array.isArray(result.body.parts)).toBe(true);
      expect(result.body.parts.length).toBe(2);
    }
  );

  test.todo(
    "should return 200 if updating parts with valid input",
    async () => {
      const name = "TestRentable /POST";
      const description = "Test description.";
      const part_name = "TestPart /POST";

      const post_result = await request(app)
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
              availability: null,
            },
          ],
        });

      const testId = post_result.body.id;

      const result = await request(app)
        .patch(`${endpoint}/${testId}`)
        .send({
          id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
          name: null,
          description: null,
          has_parts: null,
          parts: [
            {
              name: part_name + "123",
              description: description,
              quantity: 4,
              availability: null,
            },
          ],
          deleted_parts: null,
          new_parts: null,
        });

      //console.log(result.error);
      expect(result.statusCode).toBe(200);
    }
  );
});

describe("rentableRoutes /DELETE", () => {
  test("should return 404 if no rentable with id exists", async () => {
    const testId = "a3bb189e-8bf9-3888-9912-ace4e6543002";
    const result = await request(app).delete(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(404);
  });

  test("should return 200 if successfully removed", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const post_result = await request(app)
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
            availability: null,
          },
        ],
      });

    const testId = post_result.body.id;
    const result = await request(app).delete(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(200);
  });

  test("should remove rentable and parts", async () => {
    const name = "TestRentable /POST";
    const description = "Test description.";
    const part_name = "TestPart /POST";

    const post_result = await request(app)
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
            availability: null,
          },
        ],
      });

    const testId = post_result.body.id;
    const result = await request(app).delete(`${endpoint}/${testId}`);

    expect(result.statusCode).toBe(200);

    const get_result = await request(app).get(`${endpoint}/${testId}`);

    expect(get_result.status).toBe(404);
  });
});
