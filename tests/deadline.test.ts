import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testDeadline } from './helpers';
import { Deadline, deadlines } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Create a hoisted mock for the db
const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
  orderBy: vi.fn(),
}));

// Mock the database module
vi.mock('../server/db', () => ({
  db: mockDb
}));

describe('Deadline CRUD Operations', () => {
  let storage: DatabaseStorage;
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Create a new storage instance for each test
    storage = new DatabaseStorage();
    
    // Setup common mock implementations
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        orderBy: vi.fn().mockResolvedValue([])
      }))
    }));
  });

  it('should get all deadlines', async () => {
    // Setup mock to return deadlines
    const deadlineList = [
      testDeadline,
      { ...testDeadline, id: 2, title: 'Second Deadline' }
    ] as Deadline[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        orderBy: vi.fn().mockResolvedValue(deadlineList)
      }))
    }));

    // Call the method to test
    const result = await storage.getDeadlines();
    
    // Verify the result
    expect(result).toEqual(deadlineList);
    expect(result.length).toBe(2);
  });

  it('should get deadlines by project ID', async () => {
    // Setup mock to return project deadlines
    const projectDeadlines = [
      testDeadline,
      { ...testDeadline, id: 3, title: 'Project Deadline' }
    ] as Deadline[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          orderBy: vi.fn().mockResolvedValue(projectDeadlines)
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.getDeadlinesByProject(1);
    
    // Verify the result
    expect(result).toEqual(projectDeadlines);
    expect(result.length).toBe(2);
  });

  it('should create a new deadline', async () => {
    // Deadline data to create
    const deadlineData = {
      title: 'New Deadline',
      projectId: 1,
      category: 'Development',
      date: new Date('2025-01-15'),
      priority: 'urgent' as const
    };

    // Expected new deadline with ID
    const newDeadline = { id: 1, ...deadlineData };
    
    // Setup mock to return the new deadline
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([newDeadline])
      }))
    }));

    // Call the method to test
    const result = await storage.createDeadline(deadlineData);
    
    // Verify the result
    expect(result).toEqual(newDeadline);
  });

  it('should delete a deadline', async () => {
    // Setup mock to return deleted deadline
    mockDb.delete.mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1 }])
      }))
    }));

    // Call the method to test
    const result = await storage.deleteDeadline(1);
    
    // Verify the result
    expect(result).toBe(true);
  });

  it('should return false when deleting a non-existent deadline', async () => {
    // Setup mock to return empty array
    mockDb.delete.mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([])
      }))
    }));

    // Call the method to test
    const result = await storage.deleteDeadline(999);

    // Verify the result
    expect(result).toBe(false);
  });
});