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
  await db.query("TRUNCATE TABLE app_user RESTART IDENTITY CASCADE");
});

describe("userRoutes /POST", () => {
  test("should create with valid input, returning status code 201", async () => {
    const given_username: string = "testUserName";
    const given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toMatchObject({
      username: given_username.toLowerCase(),
      name: given_name,
      email: given_email.toLowerCase(),
    });
  });
});

describe("userRoutes /GET", () => {
  test("should retrieve empty list with status code 200", async () => {
    const response = await request(app).get("/api/user");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should retrieve list containing users post POST, with status code 200", async () => {
    const given_username: string = "testUserName";
    const given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    const response = await request(app).get("/api/user");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
  });
});

describe("userRoutes /GET/:id", () => {
  let testId: string;

  test("should retrieve user with valid id", async () => {
    const given_username: string = "testUserName";
    const given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    const user_post_response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    testId = user_post_response.body.id;
    const response = await request(app).get(`/api/user/${testId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body[0].id).toEqual(user_post_response.body.id);
    expect(response.body[0]).toHaveProperty("created_at");
    expect(response.body[0].username).toEqual(given_username.toLowerCase());
    expect(response.body[0].name).toEqual(given_name);
    expect(response.body[0].email).toEqual(given_email.toLowerCase());
  });

  test("should return 404 on not found", async () => {
    const response = await request(app).get(`/api/user/${testId}`);

    expect(response.statusCode).toBe(404);
  });
});

describe("userRoutes /PUT/:id", () => {
  test("should update user name and return 200", async () => {
    const given_username: string = "testUserName";
    let given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    const user_post_response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    const testId = user_post_response.body.id;
    given_name = "Tests Alot Updated";
    const response = await request(app).put(`/api/user/${testId}`).send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body[0].name).toEqual(given_name);
    expect(response.body[0].username).toEqual(given_username.toLowerCase());
    expect(response.body[0].email).toEqual(given_email.toLowerCase());
  });
});

describe.todo("userRoutes /PATCH/:id", () => {
  let testId: string;
  test("should update name and return 200", async () => {
    const given_username: string = "testUserName";
    let given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    const user_post_response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    testId = user_post_response.body.id;
    given_name = "Tests Alot Updated";

    const response = await request(app).patch(`/api/user/${testId}`).send({
      name: given_name,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).not.toBe(0);
    expect(response.body[0].id).toEqual(testId);
    expect(response.body[0].name).toEqual(given_name);
    expect(response.body[0].username).toEqual(given_username.toLowerCase());
    expect(response.body[0].email).toEqual(given_email.toLowerCase());
  });

  test("should return 404 if not found", async () => {
    const given_name = "Tests Alot Updated";

    const response = await request(app).patch(`/api/user/${testId}`).send({
      name: given_name,
    });

    expect(response.statusCode).toBe(404);
  });
});

describe("userRoutes /DELETE", () => {
  let testId: string;

  test("should delete user and return 200", async () => {
    const given_username: string = "testUserName";
    const given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    const user_post_response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    testId = user_post_response.body.id;
    const response = await request(app).delete(`/api/user/${testId}`);

    expect(response.statusCode).toBe(200);
  });

  test("should fail to delete user and return 404", async () => {
    const response = await request(app).delete(`/api/user/${testId}`);

    expect(response.statusCode).toBe(404);
  });
});
