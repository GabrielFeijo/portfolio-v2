# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript 3D portfolio using Three.js, React Three Fiber, Zustand, and Tailwind CSS. Application code lives in `src/`: `components/three/` contains scene objects and shaders, `components/ui/` contains HUD, overlays, and panels, `hooks/` holds reusable hooks, `store/` contains global state, and `data/portfolio.ts` is the main content source. Shared constants, schemas, utilities, and styles are under `src/constants/`, `src/schemas/`, `src/utils/`, and `src/styles/`. Static assets are in `public/`; tests mirror the source layout in `tests/`.

## Build, Test, and Development Commands

Use Bun, as declared in `package.json` and `bun.lock`.

- `bun install`: install dependencies.
- `bun run dev`: start the local Vite development server.
- `bun run build`: run TypeScript compilation and create the production build.
- `bun run preview`: serve the built app locally.
- `bun run typecheck`: run `tsc --noEmit`.
- `bun run lint`: lint `src` and `tests`.
- `bun run test`: run Vitest once with coverage.
- `bun run test:watch`: run Vitest in watch mode.
- `bun run check`: run typecheck, lint, and build.

## Coding Style & Naming Conventions

Write TypeScript and TSX with ES modules. Prefer small files that follow existing folder ownership. Components use `PascalCase` exports where appropriate, while filenames are generally kebab-case, for example `planet-panel.tsx` and `use-focus-trap.tsx`. Keep shared values in `src/constants/`. Format with Prettier using `bun run format`; verify with `bun run format:check`. ESLint includes React, React Hooks, JSX a11y, and TypeScript rules.

## Testing Guidelines

Tests use Vitest, Testing Library, jsdom, and React Three Fiber helpers. Place tests under `tests/` with names ending in `.test.ts` or `.test.tsx`, matching the source area when possible, such as `tests/hooks/use-focus-trap.test.tsx`. Add coverage for hooks, UI state, schemas, and 3D utilities when behavior changes. Run `bun run test` before substantial changes; use `bun run test:smoke` for a faster sanity check.

## Commit & Pull Request Guidelines

Git history uses conventional-style prefixes such as `test:`, `refactor:`, and `feat(scope):`. Keep commit subjects imperative and specific, for example `test: add contact API timeout coverage`. Pull requests should include a short description, test results, linked issues when applicable, and screenshots or screen recordings for visible UI, animation, or layout changes.

## Security & Configuration Tips

Do not commit secrets or local environment files. Keep contact API configuration isolated in `src/lib/contact-api.ts` and validate external inputs through schemas in `src/schemas/`.
