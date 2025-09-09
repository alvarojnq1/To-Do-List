import express from "express";
import pool from "./db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

// rota para pegar todas as tasks do usuario logado
router.get("/", authMiddleware, async (req, res) => {
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
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { descricao, realizada, prioridade } = req.body;

    // Buscar a task atual
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Task não encontrada ou não pertence a você" });
    }

    const task = rows[0];

    // Atualiza só os campos que vierem no body
    const newDescricao = descricao ?? task.descricao;
    const newRealizada = realizada ?? task.realizada;
    const newPrioridade = prioridade ?? task.prioridade;

    await pool.query(
      "UPDATE tasks SET descricao = ?, realizada = ?, prioridade = ? WHERE id = ? AND user_id = ?",
      [newDescricao, newRealizada, newPrioridade, req.params.id, req.user.id]
    );

    res.json({ message: "Tarefa atualizada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar a tarefa" });
  }
});

// rota para criar uma nova task
router.post("/", authMiddleware, async (req, res) => {
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
router.delete("/:id", authMiddleware, async (req, res) => {
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

export default router;
