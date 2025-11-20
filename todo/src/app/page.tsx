"use client";

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
    </TodoProvider>
  );
}
