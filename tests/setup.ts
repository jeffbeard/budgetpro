import { vi } from 'vitest';

// Set valid URL for database connection testing
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/testdb';

// Mock all the database modules
vi.mock('@neondatabase/serverless', () => {
  return {
    Pool: vi.fn().mockImplementation(() => ({
      query: vi.fn().mockResolvedValue({ rows: [] }),
      connect: vi.fn().mockImplementation(() => ({
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      })),
      end: vi.fn().mockResolvedValue(undefined),
    })),
    neonConfig: {
      webSocketConstructor: null,
    },
  };
});

// Mock console methods
global.console = {
  ...console,
  // Avoid cluttering test output with expected warnings/errors
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};