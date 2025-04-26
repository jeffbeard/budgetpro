import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testBudgetData } from './helpers';
import { BudgetData, budgetData } from '../shared/schema';
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

describe('BudgetData CRUD Operations', () => {
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

  it('should get all budget data', async () => {
    // Setup mock to return budget data
    const budgetDataList = [
      testBudgetData,
      { ...testBudgetData, id: 2, month: 'Feb', allocated: 65, spent: 50 }
    ] as BudgetData[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockResolvedValue(budgetDataList)
    }));

    // Call the method to test
    const result = await storage.getBudgetData();
    
    // Verify the result
    expect(result).toEqual(budgetDataList);
    expect(result.length).toBe(2);
  });

  it('should create a new budget data entry', async () => {
    // Budget data to create
    const budgetDataEntry = {
      month: 'Sep',
      allocated: 95,
      spent: 80
    };

    // Expected new budget data with ID
    const newBudgetData = { id: 1, ...budgetDataEntry };
    
    // Setup mock to return the new budget data
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([newBudgetData])
      }))
    }));

    // Call the method to test
    const result = await storage.createBudgetData(budgetDataEntry);
    
    // Verify the result
    expect(result).toEqual(newBudgetData);
  });

  it('should update an existing budget data entry', async () => {
    // Update data
    const updateData = {
      spent: 60,
      allocated: 75
    };

    // Expected updated budget data
    const updatedBudgetData = { ...testBudgetData, ...updateData };
    
    // Setup mock to return the updated budget data
    mockDb.update.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockResolvedValue([updatedBudgetData])
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.updateBudgetData(1, updateData);
    
    // Verify the result
    expect(result).toEqual(updatedBudgetData);
  });

  it('should return undefined when updating a non-existent budget data entry', async () => {
    // Setup mock to return empty array
    mockDb.update.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockResolvedValue([])
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.updateBudgetData(999, { spent: 100 });

    // Verify the result
    expect(result).toBeUndefined();
  });
});