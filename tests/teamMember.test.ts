import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testTeamMember } from './helpers';
import { TeamMember, teamMembers } from '../shared/schema';
import { and, eq } from 'drizzle-orm';

// Create a hoisted mock for the db
const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
}));

// Mock the database module
vi.mock('../server/db', () => ({
  db: mockDb
}));

describe('TeamMember CRUD Operations', () => {
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

  it('should get team members by project ID', async () => {
    // Setup mock to return team members for a project
    const projectTeamMembers = [
      testTeamMember,
      { ...testTeamMember, id: 2, userId: 3 }
    ] as TeamMember[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue(projectTeamMembers)
      }))
    }));

    // Call the method to test
    const result = await storage.getTeamMembersByProject(1);
    
    // Verify the result
    expect(result).toEqual(projectTeamMembers);
    expect(result.length).toBe(2);
  });

  it('should get team members by user ID', async () => {
    // Setup mock to return team members for a user
    const userTeamMembers = [
      testTeamMember,
      { ...testTeamMember, id: 3, projectId: 2 }
    ] as TeamMember[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue(userTeamMembers)
      }))
    }));

    // Call the method to test
    const result = await storage.getTeamMembersByUser(2);
    
    // Verify the result
    expect(result).toEqual(userTeamMembers);
    expect(result.length).toBe(2);
  });

  it('should add a team member', async () => {
    // Team member data to create
    const teamMemberData = {
      projectId: 1,
      userId: 2
    };

    // Expected new team member with ID
    const newTeamMember = { id: 1, ...teamMemberData };
    
    // Setup mock to return the new team member
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([newTeamMember])
      }))
    }));

    // Call the method to test
    const result = await storage.addTeamMember(teamMemberData);
    
    // Verify the result
    expect(result).toEqual(newTeamMember);
  });

  it('should remove a team member', async () => {
    // Setup mock to return deleted team member
    mockDb.delete.mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1, projectId: 1, userId: 2 }])
      }))
    }));

    // Call the method to test
    const result = await storage.removeTeamMember(1, 2);
    
    // Verify the result
    expect(result).toBe(true);
  });

  it('should return false when removing a non-existent team member', async () => {
    // Setup mock to return empty array
    mockDb.delete.mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([])
      }))
    }));

    // Call the method to test
    const result = await storage.removeTeamMember(999, 999);

    // Verify the result
    expect(result).toBe(false);
  });
});