# receipt-reader

A pnpm monorepo for a receipt reader application with shared TypeScript types.

## Project Structure

```
receipt-reader/
├── apps/
│   ├── backend/          # Express.js API server
│   └── frontend/         # React + Vite web application
└── packages/
    └── shared-types/     # Shared TypeScript types/DTOs
```

## Prerequisites

- Node.js (v18+)
- pnpm (v10.15+)

## Installation

```bash
pnpm install
```

## Development

Start all applications in parallel:

```bash
pnpm dev
```

This runs:
- Backend on http://localhost:3000
- Frontend on http://localhost:5173

## Individual Apps

### Backend
```bash
cd apps/backend
pnpm dev      # Start with hot-reload
pnpm build    # Compile TypeScript
pnpm start    # Run compiled server
```

### Frontend
```bash
cd apps/frontend
pnpm dev      # Start Vite dev server
pnpm build    # Production build
pnpm lint     # Run ESLint
```

### Shared Types
```bash
cd packages/shared-types
pnpm typecheck  # Type check without emitting
```

## Tech Stack

- **Package Manager**: pnpm 10.15
- **Backend**: Express 5.2 + TypeScript
- **Frontend**: React 19 + Vite 7 + TypeScript
- **Shared**: Pure TypeScript package
