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

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  // Load from LocalStorage on mount using lazy initializer
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Check if we're in the browser (not SSR)
    if (typeof window === 'undefined') {
      return [];
    }
    
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        // Migrate old todos to ensure they have the subtasks array
        return parsed.map((todo: Partial<Todo>) => ({
          ...todo,
          subtasks: todo.subtasks || []
        })) as Todo[];
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e);
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
