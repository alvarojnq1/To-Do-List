import { useAuth, AuthProvider } from "./context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";
import { useState } from "react";
import type { Task } from "./types/types";

// Componente de navegação entre páginas
const Navigation = () => {
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Sistema de Tarefas
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Gerencie suas tarefas de forma eficiente
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                currentView === "login"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setCurrentView("login")}
            >
              Login
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                currentView === "register"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setCurrentView("register")}
            >
              Cadastro
            </button>
          </div>

          {currentView === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

// Componente principal da aplicação após o login
const AuthenticatedApp = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Função para adicionar nova tarefa à lista
  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Bem-vindo,{" "}
            <span className="text-indigo-600">{user ? user.nome : ""}</span>
          </h1>
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Nova Tarefa
              </h2>
              <TaskForm onCreate={handleTaskCreated} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Suas Tarefas
              </h2>
              <TaskList tasks={tasks} setTasks={setTasks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente principal da aplicação
const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigation />;
  }

  return <AuthenticatedApp />;
};

export const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);
