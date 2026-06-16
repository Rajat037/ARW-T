import request from "supertest";
import app from "../server.js";

describe("GET /health", () => {
  it("should return status OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("OK");
    expect(res.body.message).toEqual("Backend is running");
  });
});
