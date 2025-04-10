import express from "express";
import cors from "cors";
import db from "./db.js";
import shoppingRoutes from "./shopping-routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { requestLogger } from "./middleware/logger.js";
import dotenv from "dotenv"; // Adicione esta linha

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 5000;
const RENDER_URL = process.env.RENDER_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Shopping List API",
      version: "1.0.0",
      description: "API para gerenciar uma lista de compras",
    },
    servers: [{ url: RENDER_URL }],
  },
  apis: ["./shopping-routes.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(requestLogger);
app.use("/api/shopping-list", shoppingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${RENDER_URL}`);
  console.log(`📚 Swagger docs available at ${RENDER_URL}/api-docs`);
});

export default app;
