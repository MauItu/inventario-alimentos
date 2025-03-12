# CLAUDE.md - Project Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run postinstall` - Generate Prisma client

## Code Style
- Use TypeScript for all files with proper type definitions
- Follow MVC pattern: models (Prisma), views (components), controllers (API)
- Add 'use client' directive for client components
- Use functional components with explicit prop types
- Create types in dedicated types.ts files
- Use tailwind classes for styling
- Prefer useState/useEffect for component state
- Use Context API for global state
- Handle errors with try/catch blocks and proper logging
- Follow existing kebab-case for filenames, PascalCase for components
- Use async/await for asynchronous operations

## Database
- Use Prisma ORM for database operations
- Define schemas in models/prisma/schema.prisma