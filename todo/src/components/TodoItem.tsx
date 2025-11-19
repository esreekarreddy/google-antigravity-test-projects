"use client";

import React from 'react';
import { Todo, useTodo } from '../context/TodoContext';

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        marginBottom: '1rem',
        animation: 'slideUp 0.3s ease-out',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => toggleTodo(todo.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `2px solid ${todo.completed ? 'var(--accent)' : 'var(--text-muted)'}`,
          marginRight: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          background: todo.completed ? 'var(--accent)' : 'transparent',
          boxShadow: todo.completed ? '0 0 10px var(--accent-glow)' : 'none',
        }}
      >
        {todo.completed && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span
        style={{
          flex: 1,
          fontSize: '1.1rem',
          color: todo.completed ? 'var(--text-muted)' : 'var(--foreground)',
          textDecoration: todo.completed ? 'line-through' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTodo(todo.id);
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--danger)',
          cursor: 'pointer',
          padding: '0.5rem',
          opacity: 0.7,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
