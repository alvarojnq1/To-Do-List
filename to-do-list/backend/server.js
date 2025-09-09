import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";
import taskRoutes from "./tasks.js";

dotenv.config();
const app = express();
app.use(express.json());

// CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Rotas
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(3000, () => console.log("Backend rodando na porta 3000"));
