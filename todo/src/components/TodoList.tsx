"use client";

import React from 'react';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos } = useTodo();

  // Filter only parent tasks (those without parentId)
  // Sort so uncompleted tasks appear first, completed tasks at bottom
  const sortedTodos = todos
    .filter((todo) => !todo.parentId)
    .sort((a, b) => {
      // If completion status differs, put uncompleted first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // If both have same completion status, sort by creation time (newest first)
      return b.createdAt - a.createdAt;
    });

  // Fix hydration mismatch by ensuring we only render the list on the client
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return nothing on server/initial render to avoid mismatch
  }

  if (sortedTodos.length === 0) {
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
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
