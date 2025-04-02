# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma client

## Code Style Guidelines
- **TypeScript**: Use strict typing, explicit return types for functions
- **Imports**: Group by source, use absolute imports with @/ prefix
- **Components**: Use functional components with 'use client' directive when needed
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **Types**: Define interfaces for complex objects, use union types for enums
- **Styling**: Use Tailwind utility classes, use cn() helper for conditional classes
- **State**: Use Context API for global state, React hooks for local state
- **Error Handling**: Use try/catch for async operations, validate status codes

## Project Structure
- `/app` - Next.js pages and app router components
- `/components` - Reusable React components
- `/lib` - Utility functions and shared code
- `/pages/api` - API endpoints
- `/prisma` - Database schema and client