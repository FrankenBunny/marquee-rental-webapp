const request = require("supertest");
const app = require("../../../server.js");
const db = require("../../../db");

/*
 *
 * CREATE TABLE app_user (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      username VARCHAR(32) NOT NULL UNIQUE,
 *      name VARCHAR(100) NOT NULL,
 *      email VARCHAR(254) NOT NULL UNIQUE,
 *      password_hash VARCHAR(255) NOT NULL,
 *      created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 */
describe("(UnitTest): /api/user POST", () => {
  it("should not create user with undefined username", async () => {
    var given_username = null;
    var given_name = "Tests Alot";
    var given_email = "TESTING@email.com";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user with empty string as username", async () => {
    var given_username = "";
    var given_name = "Tests Alot";
    var given_email = "TESTING@email.com";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user with undefined name", async () => {
    var given_username = "testUserName";
    var given_name = null;
    var given_email = "TESTING@email.com";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user with empty string as name", async () => {
    var given_username = "testUserName";
    var given_name = "";
    var given_email = "TESTING@email.com";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user with undefined email", async () => {
    var given_username = "testUserName";
    var given_name = "Tests Alot";
    var given_email = null;
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user with empty string as email", async () => {
    var given_username = "testUserName";
    var given_name = "Tests Alot";
    var given_email = "";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user with invalid email", async () => {
    var given_username = "testUserName";
    var given_name = "Tests Alot";
    var given_email = "notanemail";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should not create user without password", async () => {
    var given_username = "testUserName";
    var given_name = "Tests Alot";
    var given_email = "TESTING@email.com";
    var given_password = null;

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 500 for unexpected DB error", async () => {
    jest.spyOn(db, "query").mockImplementationOnce(() => {
      throw new Error("Simulated unexpected error");
    });

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    var given_username = "TestUsername";
    var given_name = "Tests Alot";
    var given_email = "TESTING@email.com";
    var given_password = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Unexpected error" });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
