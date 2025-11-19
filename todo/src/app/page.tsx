"use client";

import { TodoProvider } from "../context/TodoContext";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <TodoProvider>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "3rem",
              background: "linear-gradient(to right, #fff, var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-1px",
              textAlign: "center",
              animation: "fadeIn 0.8s ease-out",
            }}
          >
            Tasks
          </h1>
          
          <div style={{ width: "100%", animation: "slideUp 0.6s ease-out 0.2s backwards" }}>
            <TodoInput />
          </div>

          <div style={{ width: "100%", animation: "slideUp 0.6s ease-out 0.4s backwards" }}>
            <TodoList />
          </div>
        </div>
      </main>
    </TodoProvider>
  );
}
