export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface Task {
  id: number;
  descricao: string;
  realizada: boolean;
  prioridade: number;
  user_id: number;
}
