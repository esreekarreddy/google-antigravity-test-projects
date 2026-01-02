"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subtasks: Todo[];
  parentId?: string;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addSubtask: (parentId: string, text: string) => void;
  deleteSubtask: (parentId: string, subtaskId: string) => void;
  toggleSubtask: (parentId: string, subtaskId: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// ============ SECURITY UTILITIES ============

// Prototype pollution protection - blocks dangerous keys
function hasPrototypePollution(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object') return false;
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  const checkObject = (o: Record<string, unknown>): boolean => {
    for (const key of Object.keys(o)) {
      if (dangerousKeys.includes(key)) return true;
      if (typeof o[key] === 'object' && o[key] !== null) {
        if (checkObject(o[key] as Record<string, unknown>)) return true;
      }
    }
    return false;
  };
  
  return checkObject(obj as Record<string, unknown>);
}

// Safe JSON parse with prototype pollution protection
function safeJsonParse<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json);
    if (hasPrototypePollution(parsed)) {
      console.error('[Security] Blocked prototype pollution attempt');
      return null;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

// Validate Todo structure
function isValidTodo(item: unknown): item is Todo {
  if (!item || typeof item !== 'object') return false;
  const t = item as Record<string, unknown>;
  return (
    typeof t.id === 'string' && t.id.length > 0 &&
    typeof t.text === 'string' &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'number' &&
    (t.subtasks === undefined || Array.isArray(t.subtasks))
  );
}

// Escape HTML for safety when displaying
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] || c);
}

// ============ TODO PROVIDER ============

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  // Load from LocalStorage on mount using lazy initializer with security validation
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Check if we're in the browser (not SSR)
    if (typeof window === 'undefined') {
      return [];
    }
    
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        // SECURITY: Use safe JSON parse with prototype pollution protection
        const parsed = safeJsonParse<unknown[]>(savedTodos);
        if (!parsed || !Array.isArray(parsed)) {
          console.error('[Security] Invalid todos data structure');
          return [];
        }
        
        // SECURITY: Validate each todo and filter invalid ones
        const validTodos = parsed
          .filter(isValidTodo)
          .map((todo) => ({
            ...todo,
            // Escape text for safety
            text: escapeHtml(todo.text),
            subtasks: (todo.subtasks || [])
              .filter(isValidTodo)
              .map(st => ({ ...st, text: escapeHtml(st.text) }))
          }));
        
        return validTodos;
      } catch (e) {
        console.error('[Security] Failed to parse todos from localStorage', e);
        return [];
      }
    }
    return [];
  });

  // Save to LocalStorage whenever todos change (skip the first render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      subtasks: [],
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const addSubtask = (parentId: string, text: string) => {
    const newSubtask: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      subtasks: [],
      parentId,
    };
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === parentId
          ? { ...todo, subtasks: [...todo.subtasks, newSubtask] }
          : todo
      )
    );
  };

  const deleteSubtask = (parentId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === parentId
          ? { ...todo, subtasks: todo.subtasks.filter((st) => st.id !== subtaskId) }
          : todo
      )
    );
  };

  const toggleSubtask = (parentId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === parentId
          ? {
              ...todo,
              subtasks: todo.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : todo
      )
    );
  }

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, addSubtask, deleteSubtask, toggleSubtask }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
