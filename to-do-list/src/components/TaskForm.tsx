import { useState } from "react";
import { createTask } from "../api/api";
import type { Task } from "../types/types";

export const TaskForm = ({
  onCreate,
}: {
  onCreate: (newTask: Task) => void;
}) => {
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setIsLoading(true);
    try {
      const res = await createTask(descricao, prioridade);
      onCreate(res.data);
      setDescricao("");
      setPrioridade(1);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descrição da Tarefa
        </label>
        <input
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Fazer relatório mensal"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="prioridade"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Prioridade:{" "}
          <span className="font-semibold text-indigo-600">{prioridade}</span>
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Baixa</span>
          <input
            id="prioridade"
            type="range"
            min={1}
            max={5}
            value={prioridade}
            onChange={(e) => setPrioridade(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            disabled={isLoading}
          />
          <span className="text-xs text-gray-500">Alta</span>
        </div>

        <div className="flex justify-between mt-1 px-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`text-xs ${
                num === prioridade
                  ? "text-indigo-600 font-bold"
                  : "text-gray-400"
              }`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !descricao.trim()}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adicionando...
          </>
        ) : (
          "Adicionar Tarefa"
        )}
      </button>

      <style>
        {`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #4f46e5;
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #4f46e5;
            cursor: pointer;
            border: none;
          }
        `}
      </style>
    </form>
  );
};
