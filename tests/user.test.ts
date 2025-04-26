import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testUser } from './helpers';
import { User, users } from '../shared/schema';

// Create a hoisted mock for the db
const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

// Mock the database module
vi.mock('../server/db', () => ({
  db: mockDb
}));

describe('User CRUD Operations', () => {
  let storage: DatabaseStorage;
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Create a new storage instance for each test
    storage = new DatabaseStorage();
    
    // Setup common mock implementations
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([])
      }))
    }));
  });

  it('should get a user by ID', async () => {
    // Setup mock to return a user
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([testUser])
      }))
    }));

    // Call the method to test
    const user = await storage.getUser(1);
    
    // Verify the result
    expect(user).toEqual(testUser);
  });

  it('should return undefined when user is not found', async () => {
    // Setup mock to return empty array
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([])
      }))
    }));

    // Call the method to test
    const user = await storage.getUser(999);

    // Verify the result
    expect(user).toBeUndefined();
  });

  it('should get a user by username', async () => {
    // Setup mock to return a user
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([testUser])
      }))
    }));

    // Call the method to test
    const user = await storage.getUserByUsername('testuser');
    
    // Verify the result
    expect(user).toEqual(testUser);
  });

  it('should create a new user', async () => {
    // User data to create
    const createUserData = {
      username: 'newuser',
      password: 'password123',
      name: 'New User',
      title: 'Manager',
      initials: 'NU',
    };

    // Expected new user with ID
    const newUser = { id: 2, ...createUserData };
    
    // Setup mock to return the new user
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([newUser])
      }))
    }));

    // Call the method to test
    const result = await storage.createUser(createUserData);
    
    // Verify the result
    expect(result).toEqual(newUser);
  });

  it('should get all users', async () => {
    // Setup mock to return array of users
    const usersList = [
      testUser, 
      { id: 2, username: 'user2', name: 'User 2', password: 'hash2', initials: 'U2', title: 'Designer' }
    ] as User[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockResolvedValue(usersList)
    }));

    // Call the method to test
    const result = await storage.getAllUsers();
    
    // Verify the result
    expect(result).toEqual(usersList);
    expect(result.length).toBe(2);
  });
});