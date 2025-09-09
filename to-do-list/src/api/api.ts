import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // seu backend
});

// adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// --- funções de auth ---
export const loginUser = (email: string, senha: string) =>
  api.post("/login", { email, senha });

export const registerUser = (nome: string, email: string, senha: string) =>
  api.post("/register", { nome, email, senha });

// --- funções de tasks ---
export const getTasks = () => api.get("/tasks");
export const createTask = (descricao: string, prioridade?: number) =>
  api.post("/tasks", { descricao, prioridade });
export const updateTask = (
  id: number,
  data: Partial<{ descricao: string; realizada: boolean; prioridade: number }>
) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
