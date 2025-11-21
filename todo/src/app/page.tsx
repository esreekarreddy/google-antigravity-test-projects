"use client";

// Todo List Home Page
import { TodoProvider } from "../context/TodoContext";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <TodoProvider>
      <main className="main-container">
        <div className="content-wrapper">
          <h1 className="app-title">
            Tasks
          </h1>
          
          <div className="input-wrapper">
            <TodoInput />
          </div>

          <div className="list-wrapper">
            <TodoList />
          </div>
        </div>
      </main>
      
      {/* Signature Badge */}
      <a
        href="https://github.com/esreekarreddy/google-antigravity-test-projects"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          padding: '6px 12px',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 600,
          background: 'rgba(244, 114, 182, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(244, 114, 182, 0.3)',
          borderRadius: '20px',
          color: 'rgba(244, 114, 182, 0.9)',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(244, 114, 182, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(244, 114, 182, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.5)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(244, 114, 182, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)';
          e.currentTarget.style.color = 'rgba(244, 114, 182, 0.9)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        [SR]
      </a>
    </TodoProvider>
  );
}
