
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoController } from '../controllers/TodoController';
import { Todo, CreateTodoInput } from '../models/Todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const TodoList = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => TodoController.getTodos()
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: (newTodo: CreateTodoInput) => TodoController.createTodo(newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Todo added!",
        description: "Your new task has been created.",
      });
      setNewTodoTitle('');
    }
  });

  // Toggle todo completion mutation
  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      TodoController.updateTodo(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => TodoController.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Todo removed",
        description: "The task has been deleted.",
      });
    }
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    addTodoMutation.mutate({
      title: newTodoTitle,
      completed: false
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-28 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Tracker</h1>
        
        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={addTodoMutation.isPending}>
            Add
          </Button>
        </form>
        
        {/* Loading State */}
        {isLoading && <div className="text-center py-4">Loading tasks...</div>}
        
        {/* Todo List */}
        {!isLoading && todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Add one to get started!
          </div>
        )}
        
        <ul className="space-y-3">
          {todos.map((todo: Todo) => (
            <li 
              key={todo.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg shadow"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) => 
                    toggleTodoMutation.mutate({ 
                      id: todo.id, 
                      completed: checked as boolean 
                    })
                  }
                />
                <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodoMutation.mutate(todo.id)}
              >
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
