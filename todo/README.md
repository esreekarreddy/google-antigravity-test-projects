# Minimal Todo

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://sr-todo-list.vercel.app/)

A minimalist, mobile-responsive Todo application built with Next.js.

## Features

- **Minimalist Design**: Dark theme with neon red/crimson accents and glassmorphism effects.
- **Persistence**: Todos are saved to LocalStorage and persist across sessions.
- **Animations**: Smooth fade-ins, slide-ups, and strikethrough effects.
- **No Database**: Purely frontend state management using React Context and LocalStorage.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules & Global Variables)
- **Icons**: Custom SVG & Generated Favicon

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app`: Pages and global styles.
- `src/components`: UI components (TodoInput, TodoList, TodoItem).
- `src/context`: React Context for state management.
