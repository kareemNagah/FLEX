
import { Todo, CreateTodoInput, UpdateTodoInput } from '../models/Todo';
import { ApiService } from '../services/ApiService';

// This controller interfaces with your FastAPI backend
export class TodoController {
  private static STORAGE_KEY = 'todos';
  private static ENDPOINT = '/todos';

  // Flag to determine if we should use the API or localStorage
  private static useApi = false; // Set to true when your FastAPI backend is ready

  // Get all todos
  static async getTodos(): Promise<Todo[]> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.get<Todo[]>(this.ENDPOINT);
      } else {
        // Fallback to localStorage
        const storedTodos = localStorage.getItem(this.STORAGE_KEY);
        return storedTodos ? JSON.parse(storedTodos) : [];
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      return [];
    }
  }

  // Create a new todo
  static async createTodo(todoInput: CreateTodoInput): Promise<Todo> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.post<Todo>(this.ENDPOINT, todoInput);
      } else {
        // Fallback to localStorage
        const todos = await this.getTodos();
        const newTodo: Todo = {
          ...todoInput,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        
        const updatedTodos = [...todos, newTodo];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTodos));
        
        return newTodo;
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  }

  // Update an existing todo
  static async updateTodo(id: string, todoInput: UpdateTodoInput): Promise<Todo | null> {
    try {
      if (this.useApi) {
        // Use the API service
        return await ApiService.put<Todo>(`${this.ENDPOINT}/${id}`, todoInput);
      } else {
        // Fallback to localStorage
        const todos = await this.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);
        
        if (todoIndex === -1) return null;
        
        const updatedTodo = {
          ...todos[todoIndex],
          ...todoInput
        };
        
        todos[todoIndex] = updatedTodo;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
        
        return updatedTodo;
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  }

  // Delete a todo
  static async deleteTodo(id: string): Promise<boolean> {
    try {
      if (this.useApi) {
        // Use the API service
        await ApiService.delete<void>(`${this.ENDPOINT}/${id}`);
        return true;
      } else {
        // Fallback to localStorage
        const todos = await this.getTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);
        
        if (filteredTodos.length === todos.length) return false;
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTodos));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  }
}
