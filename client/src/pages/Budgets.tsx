import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Project } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface ProjectWithTeam {
  id: number;
  name: string;
  description: string;
  category: string;
  budget: number;
  spent: number;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  team: any[];
}

const Budgets = () => {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  
  // Fetch projects data
  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectWithTeam[]>({
    queryKey: ['/api/projects'],
  });
  
  // Fetch budget data
  const { data: budgetData, isLoading: budgetLoading } = useQuery({
    queryKey: ['/api/budget-data'],
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate total budget and spent
  const totalBudget = projects?.reduce((sum, project) => sum + project.budget, 0) || 0;
  const totalSpent = projects?.reduce((sum, project) => sum + project.spent, 0) || 0;
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsagePercentage = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  
  // Get all unique categories
  const categories = projects 
    ? ['All Categories', ...new Set(projects.map(project => project.category))]
    : ['All Categories'];
  
  // Filter projects by category
  const filteredProjects = projects
    ? (categoryFilter === 'All Categories' 
        ? projects 
        : projects.filter(project => project.category === categoryFilter))
    : [];
  
  // Prepare data for category distribution pie chart
  const categoryData = projects 
    ? Array.from(
        projects.reduce((acc, project) => {
          const category = acc.get(project.category) || { name: project.category, value: 0, budget: 0, spent: 0 };
          category.value += project.budget;
          category.budget += project.budget;
          category.spent += project.spent;
          acc.set(project.category, category);
          return acc;
        }, new Map())
      ).map(([_, data]) => data)
    : [];
  
  // Colors for pie chart
  const COLORS = ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];
  
  return (
    <>
      {/* Budgets Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Budget Management</h1>
          <p className="text-slate-500">Track and manage project budgets across your organization</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="relative">
            <select 
              className="pl-4 pr-8 py-2 rounded-md border border-slate-200 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Last 30 days</option>
              <option>Last quarter</option>
              <option>This year</option>
              <option>Custom range</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          </div>
          
          <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
            <i className="ri-download-line mr-1"></i> Export
          </button>
        </div>
      </div>
      
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Total Budget</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-blue-50 text-accent">
                <i className="ri-money-dollar-circle-line"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                <p className="text-xs text-slate-500">Across all projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Budget Spent</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-green-50 text-success">
                <i className="ri-wallet-3-line"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                <p className="text-xs text-slate-500">{budgetUsagePercentage}% of total budget</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={budgetUsagePercentage} className="h-2 bg-slate-100" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Remaining Budget</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-500">
                <i className="ri-funds-line"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(remainingBudget)}</p>
                <p className="text-xs text-slate-500">{100 - budgetUsagePercentage}% remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Budget Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Budget Allocation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">Monthly Budget Allocation</h3>
            </div>
            
            {budgetLoading ? (
              <div className="h-[300px] animate-pulse bg-slate-100 rounded"></div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar name="Allocated" dataKey="allocated" fill="hsl(var(--accent))" />
                    <Bar name="Spent" dataKey="spent" fill="hsl(var(--primary-200))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Budget Distribution by Category */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">Budget Distribution by Category</h3>
            </div>
            
            {projectsLoading ? (
              <div className="h-[300px] animate-pulse bg-slate-100 rounded"></div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Project Budget Table */}
      <Card>
        <CardContent className="pt-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Project Budgets</h3>
            
            <div className="relative">
              <select 
                className="pl-4 pr-8 py-2 rounded-md border border-slate-200 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index}>{category}</option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            </div>
          </div>
        </CardContent>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Budget</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Spent</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remaining</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}>
                      <div className="animate-pulse h-10 bg-slate-100 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No projects found in this category
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => {
                    const percentSpent = Math.min(100, Math.round((project.spent / project.budget) * 100));
                    const remaining = project.budget - project.spent;
                    const remainingPercent = Math.max(0, 100 - percentSpent);
                    const isOverBudget = project.spent > project.budget;
                    
                    return (
                      <TableRow key={project.id} className="hover:bg-slate-50">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded ${project.iconBg} flex items-center justify-center ${project.iconColor}`}>
                              <i className={project.icon}></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">{project.name}</p>
                              <p className="text-xs text-slate-500">{project.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          {project.category}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatCurrency(project.budget)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${isOverBudget ? 'text-error' : 'text-success'}`}>
                                {formatCurrency(project.spent)}
                              </span>
                              <span className="text-xs font-medium">{percentSpent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${isOverBudget ? 'bg-error' : 'bg-success'} rounded-full`} 
                                style={{ width: `${Math.min(100, percentSpent)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          {isOverBudget ? (
                            <span className="text-error">-{formatCurrency(Math.abs(remaining))}</span>
                          ) : (
                            <span>{formatCurrency(remaining)} ({remainingPercent}%)</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isOverBudget
                              ? 'bg-red-100 text-red-800'
                              : percentSpent > 90
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {isOverBudget
                              ? 'Over Budget'
                              : percentSpent > 90
                                ? 'At Risk'
                                : 'On Track'}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-slate-500 hover:text-accent mr-2">
                            <i className="ri-file-list-line"></i>
                          </button>
                          <button className="text-slate-500 hover:text-accent">
                            <i className="ri-edit-line"></i>
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Budgets;
