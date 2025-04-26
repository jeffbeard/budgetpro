import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  title: text("title"),
  initials: text("initials"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  title: true,
  initials: true,
});

// Project model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  budget: real("budget").notNull(),
  spent: real("spent").notNull().default(0),
  status: text("status").notNull().default("on track"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  progress: real("progress").notNull().default(0),
  icon: text("icon").default("ri-building-line"),
  iconBg: text("icon_bg").default("bg-blue-100"),
  iconColor: text("icon_color").default("text-accent"),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  category: true,
  budget: true,
  spent: true,
  status: true,
  startDate: true,
  endDate: true,
  progress: true,
  icon: true,
  iconBg: true,
  iconColor: true,
});

// Teams model - associates users with projects
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  projectId: true,
  userId: true,
});

// Activities model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  projectId: integer("project_id"),
  type: text("type").notNull(), // upload, comment, add_member, update_budget
  content: text("content"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  projectId: true,
  type: true,
  content: true,
});

// Deadlines model
export const deadlines = pgTable("deadlines", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  projectId: integer("project_id"),
  category: text("category"), // can be null if it's for 'All Projects'
  date: timestamp("date").notNull(),
  priority: text("priority").notNull(), // urgent, this_week, next_week, upcoming
});

export const insertDeadlineSchema = createInsertSchema(deadlines).pick({
  title: true,
  projectId: true,
  category: true,
  date: true,
  priority: true,
});

// Budget data model for chart
export const budgetData = pgTable("budget_data", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  allocated: real("allocated").notNull(),
  spent: real("spent").notNull(),
});

export const insertBudgetDataSchema = createInsertSchema(budgetData).pick({
  month: true,
  allocated: true,
  spent: true,
});

// Resource allocation model for department breakdown
export const resourceAllocation = pgTable("resource_allocation", {
  id: serial("id").primaryKey(),
  department: text("department").notNull(),
  allocation: real("allocation").notNull(), // percentage
  color: text("color").notNull(),
});

export const insertResourceAllocationSchema = createInsertSchema(resourceAllocation).pick({
  department: true,
  allocation: true,
  color: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Deadline = typeof deadlines.$inferSelect;
export type InsertDeadline = z.infer<typeof insertDeadlineSchema>;

export type BudgetData = typeof budgetData.$inferSelect;
export type InsertBudgetData = z.infer<typeof insertBudgetDataSchema>;

export type ResourceAlloc = typeof resourceAllocation.$inferSelect;
export type InsertResourceAlloc = z.infer<typeof insertResourceAllocationSchema>;

// Define relations between tables
export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  activities: many(activities)
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  teamMembers: many(teamMembers),
  activities: many(activities),
  deadlines: many(deadlines)
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id]
  }),
  project: one(projects, {
    fields: [teamMembers.projectId],
    references: [projects.id]
  })
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id]
  }),
  project: one(projects, {
    fields: [activities.projectId],
    references: [projects.id]
  })
}));

export const deadlinesRelations = relations(deadlines, ({ one }) => ({
  project: one(projects, {
    fields: [deadlines.projectId],
    references: [projects.id]
  })
}));
