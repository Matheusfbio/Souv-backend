import request from "supertest";
import app from "../app.js";
import db from "../db.js";

// Mockando o módulo 'db'
jest.mock("../db.js");

describe("Shopping List API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/shopping-list - deve retornar todos os itens", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "1",
          name: "Banana",
          quantity: 3,
          unit: "kg",
          category: "Frutas",
          completed: 0,
        },
      ],
    });

    const res = await request(app).get("/api/shopping-list");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
        id: "1",
        name: "Banana",
        quantity: 3,
        unit: "kg",
        category: "Frutas",
        completed: false,
      },
    ]);
  });

  it("POST /api/shopping-list - deve criar um novo item", async () => {
    db.query.mockResolvedValueOnce({});

    const item = {
      name: "Arroz",
      quantity: 1,
      unit: "kg",
      category: "Grãos",
    };

    const res = await request(app).post("/api/shopping-list").send(item);

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(item);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("completed", false);
  });

  it("PUT /api/shopping-list/:id - deve atualizar um item", async () => {
    db.query.mockResolvedValueOnce({});

    const updatedItem = {
      name: "Arroz integral",
      quantity: 2,
      unit: "kg",
      category: "Grãos",
      completed: true,
    };

    const res = await request(app)
      .put("/api/shopping-list/abc-123")
      .send(updatedItem);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Item atualizado" });
  });

  it("DELETE /api/shopping-list/:id - deve deletar um item", async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app).delete("/api/shopping-list/abc-123");

    expect(res.statusCode).toBe(204);
  });
});
