import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertTeamMemberSchema, 
  insertActivitySchema, 
  insertDeadlineSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup API routes
  const apiRouter = app.route('/api');

  // Dashboard overview data
  app.get('/api/dashboard', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const activities = await storage.getActivities(10);
      const deadlines = await storage.getDeadlines();
      const budgetData = await storage.getBudgetData();
      const resourceAllocations = await storage.getResourceAllocations();
      
      const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
      const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
      const budgetVariance = totalBudget > 0 ? ((totalSpent - totalBudget) / totalBudget) * 100 : 0;
      
      // Calculate overall resource allocation
      const totalAllocation = resourceAllocations.reduce((sum, resource) => sum + resource.allocation, 0);
      const avgAllocation = totalAllocation / resourceAllocations.length;
      
      const dashboardData = {
        stats: {
          totalBudget,
          totalProjects: projects.length,
          activeProjects: projects.filter(p => ['on track', 'at risk'].includes(p.status)).length,
          budgetVariance: budgetVariance.toFixed(1),
          resourceUtilization: avgAllocation.toFixed(0)
        },
        budgetData,
        resourceAllocations,
        recentActivities: activities,
        upcomingDeadlines: deadlines
      };
      
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Projects endpoints
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const enhancedProjects = await Promise.all(
        projects.map(async (project) => {
          const teamMembers = await storage.getTeamMembersByProject(project.id);
          const teamMemberIds = teamMembers.map(tm => tm.userId);
          const users = await Promise.all(teamMemberIds.map(id => storage.getUser(id)));
          return {
            ...project,
            team: users.filter(Boolean)
          };
        })
      );
      res.json(enhancedProjects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Get team members for this project
      const teamMembers = await storage.getTeamMembersByProject(id);
      const teamMemberIds = teamMembers.map(tm => tm.userId);
      const users = await Promise.all(teamMemberIds.map(id => storage.getUser(id)));
      
      // Get activities for this project
      const activities = await storage.getActivitiesByProject(id);
      
      // Get deadlines for this project
      const deadlines = await storage.getDeadlinesByProject(id);
      
      const projectDetails = {
        ...project,
        team: users.filter(Boolean),
        activities,
        deadlines
      };
      
      res.json(projectDetails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid project data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.patch('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(id, validatedData);
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid project data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      await storage.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Team Members endpoints
  app.get('/api/projects/:id/team', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Get team members for this project
      const teamMembers = await storage.getTeamMembersByProject(id);
      const teamMemberIds = teamMembers.map(tm => tm.userId);
      const users = await Promise.all(teamMemberIds.map(id => storage.getUser(id)));
      
      res.json(users.filter(Boolean));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  app.post('/api/projects/:id/team', async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const validatedData = insertTeamMemberSchema.parse({ 
        projectId, 
        userId: req.body.userId 
      });
      
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const newTeamMember = await storage.addTeamMember(validatedData);
      
      // Create activity for adding team member
      await storage.createActivity({
        userId: user.id,
        projectId,
        type: 'add_member',
        content: `${user.name} was added to the project`
      });
      
      res.status(201).json({ teamMember: newTeamMember, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid team member data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to add team member' });
    }
  });

  app.delete('/api/projects/:projectId/team/:userId', async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const userId = parseInt(req.params.userId);
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const result = await storage.removeTeamMember(projectId, userId);
      if (!result) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove team member' });
    }
  });

  // Activities endpoints
  app.get('/api/activities', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(limit);
      
      // Enhance activities with user and project info
      const enhancedActivities = await Promise.all(
        activities.map(async (activity) => {
          const user = activity.userId ? await storage.getUser(activity.userId) : null;
          const project = activity.projectId ? await storage.getProject(activity.projectId) : null;
          
          return {
            ...activity,
            user,
            project
          };
        })
      );
      
      res.json(enhancedActivities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  app.post('/api/activities', async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      
      // Verify user and project exist if provided
      if (validatedData.userId) {
        const user = await storage.getUser(validatedData.userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
      }
      
      if (validatedData.projectId) {
        const project = await storage.getProject(validatedData.projectId);
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
      }
      
      const newActivity = await storage.createActivity(validatedData);
      res.status(201).json(newActivity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid activity data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create activity' });
    }
  });

  // Deadlines endpoints
  app.get('/api/deadlines', async (req, res) => {
    try {
      const deadlines = await storage.getDeadlines();
      
      // Enhance deadlines with project info
      const enhancedDeadlines = await Promise.all(
        deadlines.map(async (deadline) => {
          const project = deadline.projectId ? await storage.getProject(deadline.projectId) : null;
          
          return {
            ...deadline,
            project
          };
        })
      );
      
      res.json(enhancedDeadlines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deadlines' });
    }
  });

  app.post('/api/deadlines', async (req, res) => {
    try {
      const validatedData = insertDeadlineSchema.parse(req.body);
      
      // Verify project exists if provided
      if (validatedData.projectId) {
        const project = await storage.getProject(validatedData.projectId);
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
      }
      
      const newDeadline = await storage.createDeadline(validatedData);
      res.status(201).json(newDeadline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid deadline data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create deadline' });
    }
  });

  app.delete('/api/deadlines/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteDeadline(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Deadline not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete deadline' });
    }
  });

  // Budget Data endpoints
  app.get('/api/budget-data', async (req, res) => {
    try {
      const budgetData = await storage.getBudgetData();
      res.json(budgetData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budget data' });
    }
  });

  // Resource Allocation endpoints
  app.get('/api/resource-allocations', async (req, res) => {
    try {
      const resourceAllocations = await storage.getResourceAllocations();
      res.json(resourceAllocations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch resource allocations' });
    }
  });

  // Users endpoints
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send password in response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Seed data endpoint
  app.post('/api/seed', async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Seeding not allowed in production' });
      }
      
      await storage.seed();
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Seed error:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
