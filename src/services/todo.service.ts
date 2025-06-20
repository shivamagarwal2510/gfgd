import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSignal = signal<Todo[]>([]);
  
  todos = this.todosSignal.asReadonly();

  addTodo(text: string): void {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      };
      this.todosSignal.update(todos => [...todos, newTodo]);
    }
  }

  toggleTodo(id: number): void {
    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: number): void {
    this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
  }

  clearCompleted(): void {
    this.todosSignal.update(todos => todos.filter(todo => !todo.completed));
  }

  get completedCount(): number {
    return this.todos().filter(todo => todo.completed).length;
  }

  get activeCount(): number {
    return this.todos().filter(todo => !todo.completed).length;
  }
}
