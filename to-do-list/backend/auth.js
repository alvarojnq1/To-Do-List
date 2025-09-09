import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "./db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const SECRET = process.env.SECRET; // ideal: usar variável de ambiente

// CADASTRO DE USUÁRIO

app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // verificar se email já existe
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length > 0) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    // hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // salvar usuário
    const [result] = await pool.query(
      "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hash]
    );

    res.json({ id: result.insertId, nome, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// LOGIN

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // buscar usuário
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = rows[0];

    // verificar senha
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// MIDDLEWARE DE AUTENTICAÇÃO

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // adiciona o usuário no request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

export { authMiddleware };
export default app;
