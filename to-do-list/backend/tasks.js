import express from "express";
import pool from "./db.js";
import { authMiddleware } from "./auth.js";

const app = express();
app.use(express.json());

// rota para pegar todas as tasks do usuario logado
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT * FROM tasks WHERE user_id = ?", [
      userId,
    ]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// rota para atualizar a task
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, realizada, prioridade } = req.body;

    // só atualiza se a task pertence ao usuário logado
    const [result] = await pool.query(
      "UPDATE tasks SET descricao = ?, realizada = ?, prioridade = ? WHERE id = ? AND user_id = ?",
      [descricao, realizada, prioridade, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Task não encontrada ou não pertence a você" });
    }

    res.json({ message: "Tarefa atualizada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar a tarefa" });
  }
});

// rota para criar uma nova task
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { descricao, prioridade } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO tasks (descricao, user_id, prioridade) VALUES (?, ?, ?)",
      [descricao, userId, prioridade || 1]
    );

    res.json({
      id: result.insertId,
      descricao,
      user_id: userId,
      prioridade: prioridade || 1,
      realizada: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar a tarefa" });
  }
});

// rota para deletar uma task
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Task não encontrada ou não pertence a você" });
    }

    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar a tarefa" });
  }
});
