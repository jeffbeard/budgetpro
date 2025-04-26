import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { User } from "@shared/schema";

// Extended Project type with team members
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
  team: User[];
}

const getStatusBadgeClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case 'on track':
      return 'bg-green-100 text-green-800';
    case 'at risk':
      return 'bg-yellow-100 text-yellow-800';
    case 'over budget':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const Projects = () => {
  const [filter, setFilter] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading } = useQuery<ProjectWithTeam[]>({
    queryKey: ['/api/projects'],
  });
  
  // Filter projects based on selected filter and search query
  const filteredProjects = data ? data.filter(project => {
    // Filter by dropdown
    const filterMatch = 
      filter === 'All Projects' || 
      (filter === 'High Priority' && project.progress > 70) ||
      (filter === 'At Risk' && project.status.toLowerCase() === 'at risk') ||
      (filter === 'Over Budget' && project.status.toLowerCase() === 'over budget');
    
    // Filter by search
    const searchMatch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return filterMatch && searchMatch;
  }) : [];
  
  return (
    <>
      {/* Projects Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500">Manage and track all active projects</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-primary-900 text-white rounded-md text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2">
            <i className="ri-add-line mr-1"></i> New Project
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-72">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select 
                  className="pl-4 pr-8 py-2 rounded-md border border-slate-200 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-full"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All Projects</option>
                  <option>High Priority</option>
                  <option>At Risk</option>
                  <option>Over Budget</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              </div>
              
              <button className="p-2 rounded-md border border-slate-200 hover:bg-slate-50">
                <i className="ri-filter-3-line"></i>
              </button>
              
              <button className="p-2 rounded-md border border-slate-200 hover:bg-slate-50">
                <i className="ri-list-check"></i>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Projects Table */}
      <Card>
        {isLoading ? (
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-[400px] bg-slate-100 rounded"></div>
            </div>
          </CardContent>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/4">Project</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Budget</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team</TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No projects found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => {
                      const percentSpent = Math.min(100, Math.round((project.spent / project.budget) * 100));
                      
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
                            <div>
                              <p>{formatCurrency(project.budget)}</p>
                              <p className="text-xs text-slate-500">
                                {formatCurrency(project.spent)} spent ({percentSpent}%)
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClasses(project.status)}`}>
                              {project.status}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, idx) => (
                                <div 
                                  key={idx} 
                                  className="h-6 w-6 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs"
                                  title={member.name}
                                >
                                  {member.initials}
                                </div>
                              ))}
                              {project.team.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button className="text-slate-500 hover:text-accent mr-2">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button className="text-slate-500 hover:text-error">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {filteredProjects.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Showing {filteredProjects.length} of {data?.length || 0} projects
                </p>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default Projects;
