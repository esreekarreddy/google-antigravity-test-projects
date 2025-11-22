"use client";

import React, { useState } from 'react';
import { Todo, useTodo } from '../context/TodoContext';

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, deleteTodo, addSubtask, deleteSubtask, toggleSubtask } = useTodo();
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [subtaskText, setSubtaskText] = useState('');

  const handleAddSubtask = () => {
    if (subtaskText.trim()) {
      addSubtask(todo.id, subtaskText.trim());
      setSubtaskText('');
      setShowSubtaskInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    } else if (e.key === 'Escape') {
      setShowSubtaskInput(false);
      setSubtaskText('');
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Parent Task */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 1.5rem',
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
        
        {/* Plus Button - matches delete button styling */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSubtaskInput(!showSubtaskInput);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            padding: '0.5rem',
            opacity: 0.7,
            transition: 'all 0.2s ease',
            marginRight: '0.5rem',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = 'rgba(244, 114, 182, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.background = 'transparent';
          }}
          title="Add subtask"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Delete Button */}
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
            borderRadius: '4px',
            opacity: 0.7,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = 'rgba(255, 99, 71, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.background = 'transparent';
          }}
          title="Delete task"
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

      {/* Subtask Input */}
      {showSubtaskInput && (
        <div
          style={{
            marginLeft: '2rem',
            marginTop: '0.5rem',
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(244, 114, 182, 0.2)',
          }}
        >
          <input
            type="text"
            value={subtaskText}
            onChange={(e) => setSubtaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a subtask..."
            autoFocus
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(244, 114, 182, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'var(--foreground)',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <button
            onClick={handleAddSubtask}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Add
          </button>
        </div>
      )}

      {/* Subtasks List */}
      {todo.subtasks && Array.isArray(todo.subtasks) && todo.subtasks.length > 0 && (
        <div style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
          {todo.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderLeft: '2px solid rgba(244, 114, 182, 0.3)',
                marginBottom: '0.5rem',
                borderRadius: '0 8px 8px 0',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => toggleSubtask(todo.id, subtask.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${subtask.completed ? 'var(--accent)' : 'var(--text-muted)'}`,
                  marginRight: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: subtask.completed ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {subtask.completed && (
                  <svg
                    width="10"
                    height="10"
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
                  fontSize: '0.95rem',
                  color: subtask.completed ? 'var(--text-muted)' : 'var(--foreground)',
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  opacity: 0.9,
                }}
              >
                {subtask.text}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubtask(todo.id, subtask.id);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  opacity: 0.6,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
              >
                <svg
                  width="16"
                  height="16"
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
          ))}
        </div>
      )}
    </div>
  );
}
