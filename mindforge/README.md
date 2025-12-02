# MindForge

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://mindforge.vercel.app/)

A powerful productivity suite for forging your ideas into reality. MindForge integrates three essential views—Mind Map, Kanban Board, and Notes Editor—into one seamless application for brainstorming, planning, and execution.

## Features

- **Mind Map View**: Visual brainstorming and idea organization with an interactive canvas.
- **Kanban Board**: Task management with drag-and-drop functionality (Todo, Doing, Done).
- **Notes Editor**: Rich text editing with markdown support and live preview.
- **Local Storage**: Auto-saves your workspace so you never lose data.
- **Theme Support**: Beautiful light and dark modes.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI & Lucide React
- **Animations**: Framer Motion

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

```
mindforge/
├── app/              # Next.js app directory
├── components/       # React components (mindmap, kanban, notes)
├── store/            # Zustand state management
└── public/           # Static assets
```
