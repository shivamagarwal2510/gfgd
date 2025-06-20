import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './services/todo.service';
import { TodoItemComponent } from './components/todo-item.component';
import { Todo, FilterType } from './models/todo.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Todo List</h1>
        <p class="subtitle">Stay organized and get things done</p>
      </header>

      <main class="main-content">
        <div class="add-todo-section">
          <form (ngSubmit)="addTodo()" class="add-todo-form">
            <input
              type="text"
              [(ngModel)]="newTodoText"
              placeholder="What needs to be done?"
              class="todo-input"
              name="newTodo"
              autocomplete="off"
            >
            <button type="submit" class="add-btn" [disabled]="!newTodoText.trim()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </form>
        </div>

        <div class="filters-section" *ngIf="todoService.todos().length > 0">
          <div class="filter-buttons">
            <button 
              *ngFor="let filter of filters" 
              [class.active]="currentFilter() === filter.value"
              (click)="setFilter(filter.value)"
              class="filter-btn"
            >
              {{ filter.label }}
            </button>
          </div>

          <div class="todo-stats">
            <span class="stat-item">{{ todoService.activeCount }} active</span>
            <span class="stat-item">{{ todoService.completedCount }} completed</span>
          </div>
        </div>

        <div class="todos-section">
          <div *ngIf="filteredTodos().length === 0 && todoService.todos().length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 11l3 3 8-8"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M11 15H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4"/>
            </svg>
            <h3>No todos yet</h3>
            <p>Add your first todo above to get started!</p>
          </div>

          <div *ngIf="filteredTodos().length === 0 && todoService.todos().length > 0" class="empty-state">
            <h3>No {{ currentFilter() }} todos</h3>
            <p>Try switching to a different filter.</p>
          </div>

          <div class="todos-list">
            <app-todo-item
              *ngFor="let todo of filteredTodos(); trackBy: trackByTodoId"
              [todo]="todo"
              (toggle)="toggleTodo($event)"
              (delete)="deleteTodo($event)"
            ></app-todo-item>
          </div>
        </div>

        <div class="actions-section" *ngIf="todoService.completedCount > 0">
          <button (click)="clearCompleted()" class="clear-completed-btn">
            Clear Completed ({{ todoService.completedCount }})
          </button>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTodoText = '';
  currentFilter = signal<FilterType>('all');

  filters = [
    { label: 'All', value: 'all' as FilterType },
    { label: 'Active', value: 'active' as FilterType },
    { label: 'Completed', value: 'completed' as FilterType }
  ];

  constructor(public todoService: TodoService) {}

  addTodo(): void {
    if (this.newTodoText.trim()) {
      this.todoService.addTodo(this.newTodoText);
      this.newTodoText = '';
    }
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  setFilter(filter: FilterType): void {
    this.currentFilter.set(filter);
  }

  filteredTodos(): Todo[] {
    const todos = this.todoService.todos();
    switch (this.currentFilter()) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}

bootstrapApplication(AppComponent);
