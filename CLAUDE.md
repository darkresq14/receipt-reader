# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a **pnpm monorepo** using workspace dependencies. The project follows a typical monorepo pattern:

```
receipt-reader/
├── apps/
│   ├── backend/          # Express.js API server (Node.js)
│   └── frontend/         # React + Vite web application
└── packages/
    └── shared-types/     # Shared TypeScript types/DTOs
```

### Key Architecture Pattern

- **Shared Types Package**: `@receipt-reader/shared-types` contains TypeScript interfaces/DTOs that are imported by both frontend and backend
- **Workspace Dependency**: Both apps reference the shared types package via `workspace:*` in package.json
- **Type Sync**: When modifying shared types, you must rebuild the shared-types package for changes to propagate

### Communication Flow

Frontend (Vite dev server on port 5173) → Proxy → Backend (Express on port 3000)

The Vite config proxies `/api` requests to `http://localhost:3000`, so frontend code uses relative paths like `fetch('/api/hello')`.

## Development Commands

### Start all apps in parallel (from root)
```bash
pnpm dev
```
This runs `dev` scripts in both backend and frontend concurrently.

### Individual app commands

**Backend** (apps/backend/):
- `pnpm dev` - Start Express server with hot-reload (ts-node-dev)
- `pnpm build` - Compile TypeScript to dist/
- `pnpm start` - Run compiled server from dist/

**Frontend** (apps/frontend/):
- `pnpm dev` - Start Vite dev server (port 5173)
- `pnpm build` - TypeScript check + production build
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build locally

**Shared Types** (packages/shared-types/):
- `pnpm build` - Compile TypeScript to dist/ (required after type changes)
- `pnpm dev` - Watch mode for type changes
- `pnpm typecheck` - Type check without emitting

## Important Workflows

### Adding or Modifying Shared Types

1. Edit types in `packages/shared-types/src/*.ts`
2. Export from `packages/shared-types/src/index.ts`
3. **Run `pnpm build` in shared-types** to regenerate dist/
4. Changes are now available to frontend/backend via workspace dependency

### Backend API Endpoints

API routes are defined in `apps/backend/server.ts` using Express router pattern:
- All routes prefixed with `/api`
- Current endpoints: `GET /api/hello`, `POST /api/greet`
- CORS is enabled for all origins

### Environment Variables

Backend uses `.env` file in `apps/backend/`. Currently only `PORT` is used (defaults to 3000).

## Tech Stack

- **Package Manager**: pnpm 10.15.1
- **Backend**: Express 5.2 + TypeScript (NodeNext module resolution)
- **Frontend**: React 19 + Vite 7 + TypeScript
- **Shared**: Pure TypeScript package with no runtime dependencies
