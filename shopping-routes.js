import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "./db.js"; // Pool do PostgreSQL

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         quantity:
 *           type: number
 *         unit:
 *           type: string
 *         category:
 *           type: string
 *         completed:
 *           type: boolean
 */

/**
 * @swagger
 * /api/shopping-list:
 *   get:
 *     summary: Retorna todos os itens da lista de compras
 *     responses:
 *       200:
 *         description: Lista de itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");
    const items = result.rows.map((i) => ({
      ...i,
      completed: Boolean(i.completed),
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

/**
 * @swagger
 * /api/shopping-list:
 *   post:
 *     summary: Adiciona um novo item à lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item criado
 */
router.post("/", async (req, res) => {
  try {
    const { name, quantity, unit, category } = req.body;
    const id = uuidv4();
    await db.query(
      `INSERT INTO items (id, name, quantity, unit, category, completed)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, name, quantity, unit, category, false]
    );

    res.status(201).json({
      id,
      name,
      quantity,
      unit,
      category,
      completed: false,
    });
  } catch (err) {
    console.error("Erro ao inserir item:", err);
    res.status(500).json({ error: "Erro ao inserir item" });
  }
});

/**
 * @swagger
 * /api/shopping-list/{id}:
 *   put:
 *     summary: Atualiza um item da lista
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item atualizado
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, category, completed } = req.body;

    await db.query(
      `UPDATE items
       SET name = $1, quantity = $2, unit = $3, category = $4, completed = $5
       WHERE id = $6`,
      [name, quantity, unit, category, completed, id]
    );

    res.json({ message: "Item atualizado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
});

/**
 * @swagger
 * /api/shopping-list/{id}:
 *   delete:
 *     summary: Remove um item da lista
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removido
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar item" });
  }
});

export default router;
