import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testResourceAlloc } from './helpers';
import { ResourceAlloc, resourceAllocation } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Create a hoisted mock for the db
const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
}));

// Mock the database module
vi.mock('../server/db', () => ({
  db: mockDb
}));

describe('ResourceAllocation CRUD Operations', () => {
  let storage: DatabaseStorage;
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Create a new storage instance for each test
    storage = new DatabaseStorage();
    
    // Setup common mock implementations
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockResolvedValue([])
    }));
  });

  it('should get all resource allocations', async () => {
    // Setup mock to return resource allocations
    const resourceAllocList = [
      testResourceAlloc,
      { ...testResourceAlloc, id: 2, department: 'Marketing', allocation: 78, color: 'bg-accent' }
    ] as ResourceAlloc[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockResolvedValue(resourceAllocList)
    }));

    // Call the method to test
    const result = await storage.getResourceAllocations();
    
    // Verify the result
    expect(result).toEqual(resourceAllocList);
    expect(result.length).toBe(2);
  });

  it('should create a new resource allocation', async () => {
    // Resource allocation data to create
    const resourceAllocData = {
      department: 'Design',
      allocation: 65,
      color: 'bg-indigo-500'
    };

    // Expected new resource allocation with ID
    const newResourceAlloc = { id: 1, ...resourceAllocData };
    
    // Setup mock to return the new resource allocation
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([newResourceAlloc])
      }))
    }));

    // Call the method to test
    const result = await storage.createResourceAllocation(resourceAllocData);
    
    // Verify the result
    expect(result).toEqual(newResourceAlloc);
  });

  it('should update an existing resource allocation', async () => {
    // Update data
    const updateData = {
      allocation: 85,
      color: 'bg-blue-500'
    };

    // Expected updated resource allocation
    const updatedResourceAlloc = { ...testResourceAlloc, ...updateData };
    
    // Setup mock to return the updated resource allocation
    mockDb.update.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockResolvedValue([updatedResourceAlloc])
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.updateResourceAllocation(1, updateData);
    
    // Verify the result
    expect(result).toEqual(updatedResourceAlloc);
  });

  it('should return undefined when updating a non-existent resource allocation', async () => {
    // Setup mock to return empty array
    mockDb.update.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockResolvedValue([])
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.updateResourceAllocation(999, { allocation: 50 });

    // Verify the result
    expect(result).toBeUndefined();
  });
});