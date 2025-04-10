// tests/app.test.js
import app from "../app.js";
import request from "supertest";

describe("Testando app.js", () => {
  it("deve responder no endpoint de documentação do Swagger", async () => {
    const res = await request(app).get("/api-docs");
    expect(res.status).toBe(301); // ou 200 dependendo da config
  });
});
