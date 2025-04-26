import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testActivity } from './helpers';
import { Activity, activities } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Create a hoisted mock for the db
const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}));

// Mock the database module
vi.mock('../server/db', () => ({
  db: mockDb
}));

describe('Activity CRUD Operations', () => {
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
    
    mockDb.orderBy.mockImplementation(() => {
      return {
        limit: vi.fn().mockResolvedValue([])
      };
    });
  });

  it('should get all activities', async () => {
    // Setup mock to return activities
    const activityList = [
      testActivity,
      { ...testActivity, id: 2, content: 'Another activity' }
    ] as Activity[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        orderBy: vi.fn().mockResolvedValue(activityList)
      }))
    }));

    // Call the method to test
    const result = await storage.getActivities();
    
    // Verify the result
    expect(result).toEqual(activityList);
    expect(result.length).toBe(2);
  });

  it('should get activities with limit', async () => {
    // Setup mock to return limited activities
    const activityList = [testActivity] as Activity[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        orderBy: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue(activityList)
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.getActivities(1);
    
    // Verify the result
    expect(result).toEqual(activityList);
    expect(result.length).toBe(1);
  });

  it('should get activities by project ID', async () => {
    // Setup mock to return project activities
    const projectActivities = [
      testActivity,
      { ...testActivity, id: 3, content: 'Project specific activity' }
    ] as Activity[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          orderBy: vi.fn().mockResolvedValue(projectActivities)
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.getActivitiesByProject(1);
    
    // Verify the result
    expect(result).toEqual(projectActivities);
    expect(result.length).toBe(2);
  });

  it('should create a new activity', async () => {
    // Activity data to create
    const activityData = {
      userId: 1,
      projectId: 2,
      type: 'comment',
      content: 'New comment on the project'
    };

    // Expected new activity with ID and timestamp
    const newActivity = { 
      id: 1, 
      ...activityData, 
      timestamp: new Date()
    };
    
    // Setup mock to return the new activity
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([newActivity])
      }))
    }));

    // Call the method to test
    const result = await storage.createActivity(activityData);
    
    // Verify the result
    expect(result).toEqual(newActivity);
  });
});