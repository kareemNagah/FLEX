
// Todo data model
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt'>;
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;
