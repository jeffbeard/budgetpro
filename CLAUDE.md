# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build frontend and backend
- `npm run check`: Run TypeScript type checking
- `npm run db:push`: Update database schema
- `npx vitest run`: Run all tests
- `npx vitest run tests/user.test.ts`: Run single test file
- `npx vitest run --coverage`: Run tests with coverage

## Docker Commands
- `npm run docker:build`: Build Docker image
- `npm run docker:dev`: Start development environment with Docker Compose
- `npm run docker:test`: Run tests inside Docker container

## CI/CD
- GitHub Actions workflow in `.github/workflows/ci.yml`
- Runs type checking, tests, and builds on pushes to main/develop branches

## Code Style Guidelines
- TypeScript with strict mode enabled
- React functional components with hooks
- Use Tailwind CSS for styling with shadcn/ui components
- Import paths: use `@/*` for client code, `@shared/*` for shared code
- Use Zod for validation and schema definitions
- Follow React Query patterns for data fetching
- Prefer explicit typing over `any` or type assertions
- Use destructuring for props and function parameters
- Handle errors with try/catch and display appropriate UI feedback
- Use async/await for asynchronous operations
- Follow naming conventions: PascalCase for components, camelCase for variables/functions