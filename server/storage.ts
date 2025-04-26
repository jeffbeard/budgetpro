import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  teamMembers, type TeamMember, type InsertTeamMember,
  activities, type Activity, type InsertActivity,
  deadlines, type Deadline, type InsertDeadline,
  budgetData, type BudgetData, type InsertBudgetData,
  resourceAllocation, type ResourceAlloc, type InsertResourceAlloc
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Team Members
  getTeamMembersByProject(projectId: number): Promise<TeamMember[]>;
  getTeamMembersByUser(userId: number): Promise<TeamMember[]>;
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(projectId: number, userId: number): Promise<boolean>;

  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  getActivitiesByProject(projectId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Deadlines
  getDeadlines(): Promise<Deadline[]>;
  getDeadlinesByProject(projectId: number): Promise<Deadline[]>;
  createDeadline(deadline: InsertDeadline): Promise<Deadline>;
  deleteDeadline(id: number): Promise<boolean>;

  // Budget Data
  getBudgetData(): Promise<BudgetData[]>;
  createBudgetData(data: InsertBudgetData): Promise<BudgetData>;
  updateBudgetData(id: number, data: Partial<InsertBudgetData>): Promise<BudgetData | undefined>;

  // Resource Allocation
  getResourceAllocations(): Promise<ResourceAlloc[]>;
  createResourceAllocation(allocation: InsertResourceAlloc): Promise<ResourceAlloc>;
  updateResourceAllocation(id: number, allocation: Partial<InsertResourceAlloc>): Promise<ResourceAlloc | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [result] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return !!result; // Return true if we got a result, false otherwise
  }

  async getTeamMembersByProject(projectId: number): Promise<TeamMember[]> {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.projectId, projectId));
  }

  async getTeamMembersByUser(userId: number): Promise<TeamMember[]> {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId));
  }

  async addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const [newTeamMember] = await db
      .insert(teamMembers)
      .values(teamMember)
      .returning();
    return newTeamMember;
  }

  async removeTeamMember(projectId: number, userId: number): Promise<boolean> {
    const [result] = await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.projectId, projectId),
          eq(teamMembers.userId, userId)
        )
      )
      .returning();
    return !!result; // Return true if we got a result, false otherwise
  }

  async getActivities(limit?: number): Promise<Activity[]> {
    if (limit) {
      return await db
        .select()
        .from(activities)
        .orderBy(activities.timestamp)
        .limit(limit);
    }
    
    return await db
      .select()
      .from(activities)
      .orderBy(activities.timestamp);
  }

  async getActivitiesByProject(projectId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.projectId, projectId))
      .orderBy(activities.timestamp);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  async getDeadlines(): Promise<Deadline[]> {
    return await db
      .select()
      .from(deadlines)
      .orderBy(deadlines.date);
  }

  async getDeadlinesByProject(projectId: number): Promise<Deadline[]> {
    return await db
      .select()
      .from(deadlines)
      .where(eq(deadlines.projectId, projectId))
      .orderBy(deadlines.date);
  }

  async createDeadline(deadline: InsertDeadline): Promise<Deadline> {
    const [newDeadline] = await db
      .insert(deadlines)
      .values(deadline)
      .returning();
    return newDeadline;
  }

  async deleteDeadline(id: number): Promise<boolean> {
    const [result] = await db
      .delete(deadlines)
      .where(eq(deadlines.id, id))
      .returning();
    return !!result; // Return true if we got a result, false otherwise
  }

  async getBudgetData(): Promise<BudgetData[]> {
    return await db
      .select()
      .from(budgetData);
  }

  async createBudgetData(data: InsertBudgetData): Promise<BudgetData> {
    const [newBudgetData] = await db
      .insert(budgetData)
      .values(data)
      .returning();
    return newBudgetData;
  }

  async updateBudgetData(id: number, data: Partial<InsertBudgetData>): Promise<BudgetData | undefined> {
    const [updatedBudgetData] = await db
      .update(budgetData)
      .set(data)
      .where(eq(budgetData.id, id))
      .returning();
    return updatedBudgetData || undefined;
  }

  async getResourceAllocations(): Promise<ResourceAlloc[]> {
    return await db
      .select()
      .from(resourceAllocation);
  }

  async createResourceAllocation(allocation: InsertResourceAlloc): Promise<ResourceAlloc> {
    const [newAllocation] = await db
      .insert(resourceAllocation)
      .values(allocation)
      .returning();
    return newAllocation;
  }

  async updateResourceAllocation(id: number, allocation: Partial<InsertResourceAlloc>): Promise<ResourceAlloc | undefined> {
    const [updatedAllocation] = await db
      .update(resourceAllocation)
      .set(allocation)
      .where(eq(resourceAllocation.id, id))
      .returning();
    return updatedAllocation || undefined;
  }

  // A method to seed the database with initial data
  async seed() {
    // Sample Users
    await this.createUser({ username: "johndoe", password: "password", name: "John Doe", title: "CEO", initials: "JD" });
    await this.createUser({ username: "sarahmiller", password: "password", name: "Sarah Miller", title: "Project Manager", initials: "SM" });
    await this.createUser({ username: "jameswilson", password: "password", name: "James Wilson", title: "Senior Developer", initials: "JW" });
    await this.createUser({ username: "karenlee", password: "password", name: "Karen Lee", title: "UX Designer", initials: "KL" });
    await this.createUser({ username: "paulroberts", password: "password", name: "Paul Roberts", title: "Marketing Director", initials: "PR" });
    await this.createUser({ username: "daviscook", password: "password", name: "Davis Cook", title: "Product Manager", initials: "DC" });
    await this.createUser({ username: "richardjones", password: "password", name: "Richard Jones", title: "Lead Designer", initials: "RJ" });
    await this.createUser({ username: "amyliu", password: "password", name: "Amy Liu", title: "Frontend Developer", initials: "AL" });

    // Sample Projects
    const enterprisePortal = await this.createProject({
      name: "Enterprise Portal",
      description: "Web Platform",
      category: "Web Development",
      budget: 250000,
      spent: 180000,
      status: "on track",
      startDate: new Date("2023-09-10"),
      endDate: new Date("2023-12-21"),
      progress: 60,
      icon: "ri-building-line",
      iconBg: "bg-blue-100",
      iconColor: "text-accent"
    });

    const mobileApp = await this.createProject({
      name: "Mobile App Redesign",
      description: "UX/UI Design",
      category: "Design",
      budget: 120000,
      spent: 105000,
      status: "at risk",
      startDate: new Date("2023-07-15"),
      endDate: new Date("2023-10-30"),
      progress: 80,
      icon: "ri-smartphone-line",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    });

    const ecommerce = await this.createProject({
      name: "E-commerce Platform",
      description: "Web Development",
      category: "Web Development",
      budget: 350000,
      spent: 175000,
      status: "on track",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2024-01-20"),
      progress: 40,
      icon: "ri-store-2-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    });

    const marketingCampaign = await this.createProject({
      name: "Marketing Campaign",
      description: "Q4 Launch",
      category: "Marketing",
      budget: 85000,
      spent: 95000,
      status: "over budget",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-12-05"),
      progress: 75,
      icon: "ri-presentation-line",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    });

    // Sample Team Members
    // Enterprise Portal
    await this.addTeamMember({ projectId: enterprisePortal.id, userId: 2 }); // Sarah Miller
    await this.addTeamMember({ projectId: enterprisePortal.id, userId: 3 }); // James Wilson
    await this.addTeamMember({ projectId: enterprisePortal.id, userId: 4 }); // Karen Lee

    // Mobile App
    await this.addTeamMember({ projectId: mobileApp.id, userId: 7 }); // Richard Jones
    await this.addTeamMember({ projectId: mobileApp.id, userId: 8 }); // Amy Liu

    // E-commerce
    await this.addTeamMember({ projectId: ecommerce.id, userId: 5 }); // Paul Roberts
    await this.addTeamMember({ projectId: ecommerce.id, userId: 6 }); // Davis Cook
    await this.addTeamMember({ projectId: ecommerce.id, userId: 4 }); // Karen Lee

    // Marketing Campaign
    await this.addTeamMember({ projectId: marketingCampaign.id, userId: 5 }); // Paul Roberts
    await this.addTeamMember({ projectId: marketingCampaign.id, userId: 2 }); // Sarah Miller

    // Sample Activities
    await this.createActivity({
      userId: 2, // Sarah Miller
      projectId: enterprisePortal.id,
      type: "upload",
      content: "Budget-Update-Q3.xlsx"
    });

    await this.createActivity({
      userId: 3, // James Wilson
      projectId: marketingCampaign.id,
      type: "comment",
      content: "We need to revise the budget allocation for the social media ads. Current spend is exceeding our projections."
    });

    await this.createActivity({
      userId: 4, // Karen Lee
      projectId: ecommerce.id,
      type: "add_member",
      content: "Added 3 team members"
    });

    await this.createActivity({
      userId: 5, // Paul Roberts
      projectId: mobileApp.id,
      type: "update_budget",
      content: "Budget increased from $100,000 to $120,000"
    });

    // Sample Deadlines
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await this.createDeadline({
      title: "Budget Review",
      projectId: enterprisePortal.id,
      category: "Finance",
      date: tomorrow,
      priority: "urgent"
    });

    await this.createDeadline({
      title: "Resource Allocation",
      projectId: mobileApp.id,
      category: "Resources",
      date: new Date("2023-10-05"),
      priority: "this_week"
    });

    await this.createDeadline({
      title: "Q4 Budget Planning",
      projectId: null, // All projects
      category: "Finance",
      date: new Date("2023-10-10"),
      priority: "next_week"
    });

    await this.createDeadline({
      title: "Project Milestone",
      projectId: ecommerce.id,
      category: "Development",
      date: new Date("2023-10-15"),
      priority: "upcoming"
    });

    // Sample Budget Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const allocatedValues = [45, 65, 80, 70, 90, 60, 75, 85];
    const spentValues = [35, 50, 60, 55, 85, 45, 60, 70];

    for (let i = 0; i < months.length; i++) {
      await this.createBudgetData({
        month: months[i],
        allocated: allocatedValues[i],
        spent: spentValues[i]
      });
    }

    // Sample Resource Allocation
    await this.createResourceAllocation({
      department: "Development",
      allocation: 92,
      color: "bg-success"
    });

    await this.createResourceAllocation({
      department: "Marketing",
      allocation: 78,
      color: "bg-accent"
    });

    await this.createResourceAllocation({
      department: "Design",
      allocation: 65,
      color: "bg-indigo-500"
    });

    await this.createResourceAllocation({
      department: "Operations",
      allocation: 42,
      color: "bg-warning"
    });
  }
}

export const storage = new DatabaseStorage();