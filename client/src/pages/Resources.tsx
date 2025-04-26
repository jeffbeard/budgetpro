import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { ResourceAlloc } from "@shared/schema";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
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

const getColorClass = (allocation: number) => {
  if (allocation >= 90) return "bg-error";
  if (allocation >= 70) return "bg-warning";
  return "bg-success";
};

const Resources = () => {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  
  // Fetch resource allocation data
  const { data: resourceAllocations, isLoading: resourceLoading } = useQuery<ResourceAlloc[]>({
    queryKey: ['/api/resource-allocations'],
  });
  
  // Fetch projects data
  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectWithTeam[]>({
    queryKey: ['/api/projects'],
  });
  
  // Convert color classes to hex colors for charts
  const colorMap: Record<string, string> = {
    'bg-success': '#10b981',     // green-500
    'bg-accent': '#2563eb',      // blue-600
    'bg-indigo-500': '#6366f1',  // indigo-500
    'bg-warning': '#f59e0b',     // amber-500
    'bg-error': '#ef4444',       // red-500
  };
  
  // Calculate overall resource utilization
  const totalAllocation = resourceAllocations?.reduce((acc, curr) => acc + curr.allocation, 0) || 0;
  const avgAllocation = resourceAllocations ? totalAllocation / resourceAllocations.length : 0;
  
  // Data for resource allocation by department
  const pieData = resourceAllocations?.map(item => ({
    name: item.department,
    value: item.allocation,
    color: colorMap[item.color] || '#ccc'
  })) || [];
  
  // Prepare data for project resource usage chart
  const projectResourceData = projects?.map(project => ({
    name: project.name,
    resources: project.team.length,
    progress: project.progress
  })) || [];
  
  // Calculate resource efficiency (progress percentage / team size)
  const resourceEfficiencyData = projects?.map(project => {
    const teamSize = project.team.length || 1; // Avoid division by zero
    const efficiency = project.progress / teamSize;
    return {
      name: project.name,
      efficiency: Math.round(efficiency * 10) / 10, // Round to 1 decimal
      teamSize
    };
  }) || [];
  
  return (
    <>
      {/* Resources Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resource Management</h1>
          <p className="text-slate-500">Track and optimize resource allocation across projects</p>
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
          
          <button className="px-4 py-2 bg-primary-900 text-white rounded-md text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2">
            <i className="ri-add-line mr-1"></i> Allocate Resources
          </button>
        </div>
      </div>
      
      {/* Resource Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Resource Utilization</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-blue-50 text-accent">
                <i className="ri-team-line"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(avgAllocation)}%</p>
                <p className="text-xs text-slate-500">Overall resource allocation</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={avgAllocation} 
                className={`h-2 ${avgAllocation > 90 
                  ? 'bg-error' 
                  : avgAllocation > 70 
                    ? 'bg-warning' 
                    : 'bg-success'}`} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Team Size</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-green-50 text-success">
                <i className="ri-user-line"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projectsLoading 
                    ? "Loading..." 
                    : projects?.reduce((sum, project) => sum + project.team.length, 0) || 0}
                </p>
                <p className="text-xs text-slate-500">Team members across all projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Resource Efficiency</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-500">
                <i className="ri-line-chart-line"></i>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projectsLoading 
                    ? "Loading..." 
                    : Math.round(
                        (projects?.reduce((sum, p) => sum + p.progress, 0) || 0) / 
                        (projects?.length || 1)
                      ) + "%"}
                </p>
                <p className="text-xs text-slate-500">Average project progress rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resource Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Allocation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">Department Allocation</h3>
            </div>
            
            {resourceLoading ? (
              <div className="h-[300px] animate-pulse bg-slate-100 rounded"></div>
            ) : (
              <div className="flex flex-col">
                {/* Adjusted height and removed flex-1 to prevent overflow */}
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-3">
                  {resourceAllocations?.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{item.department}</span>
                        <span className="text-xs font-medium">{item.allocation}%</span>
                      </div>
                      <Progress value={item.allocation} className={`h-2 ${item.color}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Project Resource Usage */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">Project Resource Usage</h3>
            </div>
            
            {projectsLoading ? (
              <div className="h-[300px] animate-pulse bg-slate-100 rounded"></div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectResourceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Team Size" dataKey="resources" fill="#2563eb" />
                    <Bar name="Progress %" dataKey="progress" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Resource Efficiency Table */}
      <Card className="mb-6">
        <CardContent className="pt-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Resource Efficiency by Project</h3>
          </div>
        </CardContent>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team Size</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Efficiency Score</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <div className="animate-pulse h-10 bg-slate-100 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                resourceEfficiencyData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : (
                  resourceEfficiencyData
                    .sort((a, b) => b.efficiency - a.efficiency) // Sort by efficiency (highest first)
                    .map((item, index) => {
                      // Get the corresponding project for additional data
                      const project = projects?.find(p => p.name === item.name);
                      
                      // Determine efficiency status
                      let efficiencyStatus;
                      let statusClasses;
                      
                      if (item.efficiency > 15) {
                        efficiencyStatus = "Excellent";
                        statusClasses = "bg-green-100 text-green-800";
                      } else if (item.efficiency > 10) {
                        efficiencyStatus = "Good";
                        statusClasses = "bg-blue-100 text-blue-800";
                      } else if (item.efficiency > 5) {
                        efficiencyStatus = "Average";
                        statusClasses = "bg-yellow-100 text-yellow-800";
                      } else {
                        efficiencyStatus = "Low";
                        statusClasses = "bg-red-100 text-red-800";
                      }
                      
                      return (
                        <TableRow key={index} className="hover:bg-slate-50">
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {project ? (
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded ${project.iconBg} flex items-center justify-center ${project.iconColor}`}>
                                  <i className={project.icon}></i>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-slate-500">{project.description}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm font-medium">{item.name}</p>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.teamSize} members
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{project?.progress || 0}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent rounded-full" 
                                  style={{ width: `${project?.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-2">
                                <span className="font-bold">{item.efficiency}</span>
                              </div>
                              <span>points per team member</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusClasses}`}>
                              {efficiencyStatus}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-slate-500 hover:text-accent mr-2">
                              <i className="ri-team-line"></i>
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
      
      {/* Department Resource Allocation */}
      <Card>
        <CardContent className="pt-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Department Resource Allocation</h3>
            <button className="text-sm text-accent hover:underline">Adjust Allocation</button>
          </div>
        </CardContent>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team Members</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Allocation</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Optimal Allocation</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Variance</TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <div className="animate-pulse h-10 bg-slate-100 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                resourceAllocations?.map((department, index) => {
                  // Mock data for demonstration
                  const members = Math.floor(Math.random() * 10) + 5;
                  const optimalAllocation = Math.min(100, Math.floor(department.allocation * (Math.random() * 0.4 + 0.8)));
                  const variance = department.allocation - optimalAllocation;
                  const isOverallocated = variance > 0;
                  
                  return (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded bg-slate-100 flex items-center justify-center ${department.color.replace('bg-', 'text-')}`}>
                            <i className="ri-team-line"></i>
                          </div>
                          <p className="ml-3 text-sm font-medium">{department.department}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        {members} team members
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{department.allocation}%</span>
                          </div>
                          <Progress value={department.allocation} className={`h-2 ${department.color}`} />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{optimalAllocation}%</span>
                          </div>
                          <Progress value={optimalAllocation} className="h-2 bg-slate-300" />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={isOverallocated ? 'text-error' : 'text-success'}>
                          {isOverallocated ? '+' : ''}{variance}%
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-500 hover:text-accent mr-2">
                          <i className="ri-equalizer-line"></i>
                        </button>
                        <button className="text-slate-500 hover:text-accent">
                          <i className="ri-edit-line"></i>
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Resources;
