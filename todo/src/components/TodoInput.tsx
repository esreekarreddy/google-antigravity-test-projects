"use client";

import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';

export default function TodoInput() {
  const [text, setText] = useState('');
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '2rem' }}>
      <div style={{ position: 'relative', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="glass-panel"
          style={{
            flex: 1,
            padding: '1rem 1.5rem',
            color: 'var(--foreground)',
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 0 15px var(--accent-glow)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
          }}
        />
        <button
          type="submit"
          className="glass-panel"
          style={{
            padding: '0 2rem',
            color: 'var(--accent)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
          }}
        >
          Add
        </button>
      </div>
    </form>
  );
}
