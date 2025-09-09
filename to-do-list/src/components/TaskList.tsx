import { useEffect, useState } from "react";
import type { Task } from "../types/types";
import { getTasks, updateTask, deleteTask } from "../api/api";

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (task: Task) => {
    try {
      await updateTask(task.id, { realizada: !task.realizada });
      // Atualiza localmente em vez de recarregar tudo
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, realizada: !t.realizada } : t
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      // Recarrega se der erro
      fetchTasks();
    }
  };

  const removeTask = async (id: number) => {
    try {
      await deleteTask(id);
      // Remove localmente em vez de recarregar tudo
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      // Recarrega se der erro
      fetchTasks();
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTasks = tasks.filter((task) => task.realizada);
      await Promise.all(completedTasks.map((task) => deleteTask(task.id)));
      // Remove localmente as tarefas concluídas
      setTasks(tasks.filter((task) => !task.realizada));
    } catch (error) {
      console.error("Erro ao limpar tarefas concluídas:", error);
      // Recarrega se der erro
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.realizada;
    if (filter === "completed") return task.realizada;
    return true;
  });

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      case 3:
        return "bg-yellow-100 text-yellow-800";
      case 4:
        return "bg-orange-100 text-orange-800";
      case 5:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return "Muito Baixa";
      case 2:
        return "Baixa";
      case 3:
        return "Média";
      case 4:
        return "Alta";
      case 5:
        return "Muito Alta";
      default:
        return "Não definida";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header com filtros e estatísticas */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Tarefas ({filteredTasks.length})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === "all"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === "active"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === "completed"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Concluídas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de tarefas */}
      <ul className="divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <li className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              {filter === "completed"
                ? "Nenhuma tarefa concluída"
                : filter === "active"
                ? "Todas as tarefas concluídas!"
                : "Nenhuma tarefa encontrada"}
            </p>
          </li>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                      task.realizada
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                    title={
                      task.realizada
                        ? "Marcar como pendente"
                        : "Marcar como concluída"
                    }
                  >
                    {task.realizada ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : null}
                  </button>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        task.realizada
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.descricao}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(
                          task.prioridade
                        )}`}
                      >
                        {getPriorityText(task.prioridade)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Deletar tarefa"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Footer com ações */}
      {tasks.some((task) => task.realizada) && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {tasks.filter((task) => task.realizada).length} de {tasks.length}{" "}
              tarefas concluídas
            </span>
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Limpar concluídas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
