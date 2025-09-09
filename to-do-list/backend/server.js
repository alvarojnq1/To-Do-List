import express from "express";
import pool from "./db.js";

const app = express();
app.use(express.json());

// Rota de teste (conexão com banco)
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ db: "ok", result: rows[0].result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro na conexão com o banco" });
  }
});

// Inicia servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
