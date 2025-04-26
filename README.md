# BudgetPro - Business Management Platform

A comprehensive business management platform designed to streamline project budget tracking, resource allocation, and team collaboration.

## Key Features

- Real-time project budget monitoring
- Resource allocation tracking and visualization
- Admin management interface
- Comprehensive CRUD operations for all project entities
- Dashboard with KPI cards, charts, and activity feeds
- Team collaboration tools

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Routing**: wouter

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/budgetpro.git
cd budgetpro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
DATABASE_URL=postgresql://username:password@localhost:5432/budgetpro
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- **client/**: Frontend React application
  - **src/components/**: UI components
  - **src/pages/**: Application pages
  - **src/hooks/**: Custom React hooks
  - **src/lib/**: Utility functions and helpers
- **server/**: Backend Express application
  - **routes.ts**: API route definitions
  - **storage.ts**: Data access layer
  - **db.ts**: Database connection
- **shared/**: Code shared between client and server
  - **schema.ts**: Database schema and types

## API Endpoints

The application provides a comprehensive set of API endpoints for managing:
- Projects
- Team members
- Budget data
- Resource allocations
- Activities
- Deadlines
- Users

## License

This project is licensed under the MIT License - see the LICENSE file for details.