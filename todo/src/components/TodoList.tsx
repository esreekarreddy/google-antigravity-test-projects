"use client";

import React from 'react';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos } = useTodo();

  if (todos.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          marginTop: '4rem',
          animation: 'fadeIn 0.5s ease',
        }}
      >
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No tasks yet.</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
