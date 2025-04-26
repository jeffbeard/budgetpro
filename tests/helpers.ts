import { vi } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import * as schema from '../shared/schema';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';

// Create hoisted mock but don't export it directly
const mockDbFn = vi.hoisted(() => {
  const mockObject = {
    select: vi.fn(() => mockObject),
    from: vi.fn(() => mockObject),
    where: vi.fn(() => mockObject),
    insert: vi.fn(() => mockObject),
    values: vi.fn(() => mockObject),
    update: vi.fn(() => mockObject),
    set: vi.fn(() => mockObject),
    delete: vi.fn(() => mockObject),
    returning: vi.fn(() => []),
  };
  return mockObject;
});

// Export the mock database
export const mockDb = mockDbFn;

// Mock the drizzle module
vi.mock('drizzle-orm/neon-serverless', () => {
  return {
    drizzle: vi.fn().mockReturnValue(mockDb),
  };
});

// Mock the Pool class
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

// Reset mocks between tests
export function resetMocks() {
  vi.clearAllMocks();
  
  // Reset all mockDb functions
  Object.keys(mockDb).forEach(key => {
    if (typeof mockDb[key].mockReset === 'function') {
      mockDb[key].mockReset();
    }
  });
  
  // Set up default return for returning
  mockDb.returning.mockResolvedValue([]);
}

// Create test data
export const testUser = {
  id: 1,
  username: 'testuser',
  password: 'hashedpassword',
  name: 'Test User',
  title: 'Developer',
  initials: 'TU',
};

export const testProject = {
  id: 1,
  name: 'Test Project',
  description: 'A test project',
  category: 'Test',
  budget: 10000,
  spent: 5000,
  status: 'on track',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  progress: 50,
  icon: 'code',
  iconBg: 'bg-blue-500',
  iconColor: 'text-white',
};

export const testTeamMember = {
  id: 1,
  projectId: 1,
  userId: 1,
};

export const testActivity = {
  id: 1,
  userId: 1,
  projectId: 1,
  type: 'comment',
  content: 'Test activity',
  timestamp: new Date(),
};

export const testDeadline = {
  id: 1,
  title: 'Test Deadline',
  projectId: 1,
  category: 'Test',
  date: new Date('2025-06-01'),
  priority: 'upcoming',
};

export const testBudgetData = {
  id: 1,
  month: 'Jan',
  allocated: 10000,
  spent: 8000,
};

export const testResourceAlloc = {
  id: 1,
  department: 'Development',
  allocation: 40,
  color: 'bg-blue-500',
};