import { vi, describe, expect, test } from "vitest";
import request from "supertest";
import app from "../../../../src/app.js";

vi.mock('../../../../src/db/client.js', () => {
  return {
    default: {
      query: vi.fn().mockImplementation(() => {
        throw new Error('Simulated DB failure');
      }),
      connect: vi.fn(),
      disconnect: vi.fn(),
      client: {}
    }
  };
});

describe.todo("userRoutes /POST (unittests for error handling)", () => {
  test("should not create with undefined username", async () => {
    const given_username: unknown = undefined;
    const given_name: string = "Tests Alot";
    const given_email: string = "TESTING@email.com";
    const given_password: string = "test123";

    const response = await request(app).post("/api/user").send({
      username: given_username,
      name: given_name,
      email: given_email,
      password: given_password,
    });

    expect(response.statusCode).toBe(400);
  });
});
