import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseStorage } from '../server/storage';
import { testProject } from './helpers';
import { Project, projects } from '../shared/schema';

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

describe('Project CRUD Operations', () => {
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

  it('should get a project by ID', async () => {
    // Setup mock to return a project
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([testProject])
      }))
    }));

    // Call the method to test
    const project = await storage.getProject(1);
    
    // Verify the result
    expect(project).toEqual(testProject);
  });

  it('should return undefined when project is not found', async () => {
    // Setup mock to return empty array
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([])
      }))
    }));

    // Call the method to test
    const project = await storage.getProject(999);

    // Verify the result
    expect(project).toBeUndefined();
  });

  it('should get all projects', async () => {
    // Setup mock to return array of projects
    const projectsList = [
      testProject, 
      { 
        id: 2, 
        name: 'Second Project', 
        description: 'Another project',
        category: 'Marketing',
        budget: 20000,
        spent: 10000,
        status: 'at risk',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-12-15'),
        progress: 30,
        icon: 'test',
        iconBg: 'bg-red-500',
        iconColor: 'text-white'
      }
    ] as Project[];
    
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockResolvedValue(projectsList)
    }));

    // Call the method to test
    const result = await storage.getProjects();
    
    // Verify the result
    expect(result).toEqual(projectsList);
    expect(result.length).toBe(2);
  });

  it('should create a new project', async () => {
    // Project data to create
    const newProjectData = {
      name: 'New Project',
      description: 'A newly created project',
      category: 'Development',
      budget: 15000,
      spent: 0,
      status: 'on track',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-07-31'),
      progress: 0,
      icon: 'desktop',
      iconBg: 'bg-green-500',
      iconColor: 'text-white',
    };

    // Expected new project with ID
    const createdProject = { id: 3, ...newProjectData };
    
    // Setup mock to return the new project
    mockDb.insert.mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([createdProject])
      }))
    }));

    // Call the method to test
    const result = await storage.createProject(newProjectData);
    
    // Verify the result
    expect(result).toEqual(createdProject);
  });

  it('should update an existing project', async () => {
    // Update data
    const updateData = {
      name: 'Updated Project Name',
      budget: 20000,
      status: 'at risk',
    };

    // Expected updated project
    const updatedProject = { ...testProject, ...updateData };
    
    // Setup mock to return the updated project
    mockDb.update.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockResolvedValue([updatedProject])
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.updateProject(1, updateData);
    
    // Verify the result
    expect(result).toEqual(updatedProject);
  });

  it('should return undefined when updating a non-existent project', async () => {
    // Setup mock to return empty array
    mockDb.update.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockResolvedValue([])
        }))
      }))
    }));

    // Call the method to test
    const result = await storage.updateProject(999, { name: 'Does Not Exist' });

    // Verify the result
    expect(result).toBeUndefined();
  });

  it('should delete a project', async () => {
    // Setup mock to return deleted project
    mockDb.delete.mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1 }])
      }))
    }));

    // Call the method to test
    const result = await storage.deleteProject(1);
    
    // Verify the result
    expect(result).toBe(true);
  });

  it('should return false when deleting a non-existent project', async () => {
    // Setup mock to return empty array
    mockDb.delete.mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockResolvedValue([])
      }))
    }));

    // Call the method to test
    const result = await storage.deleteProject(999);

    // Verify the result
    expect(result).toBe(false);
  });
});