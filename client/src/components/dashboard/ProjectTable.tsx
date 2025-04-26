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

const getProgressBarColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'on track':
      return 'bg-success';
    case 'at risk':
      return 'bg-warning';
    case 'over budget':
      return 'bg-error';
    default:
      return 'bg-accent';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const ProjectTable = () => {
  const [filter, setFilter] = useState('All Projects');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading } = useQuery<ProjectWithTeam[]>({
    queryKey: ['/api/projects'],
  });
  
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-[400px] bg-slate-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filter projects based on selected filter
  const filteredProjects = data ? data.filter(project => {
    if (filter === 'All Projects') return true;
    if (filter === 'High Priority' && project.progress > 70) return true;
    if (filter === 'At Risk' && project.status.toLowerCase() === 'at risk') return true;
    return false;
  }) : [];
  
  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.ceil((filteredProjects?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <Card className="mb-6">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Active Projects</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                className="pl-4 pr-8 py-2 rounded-md border border-slate-200 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All Projects</option>
                <option>High Priority</option>
                <option>At Risk</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            </div>
            <button className="p-2 rounded-md hover:bg-slate-100">
              <i className="ri-filter-3-line"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Budget</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Spent</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timeline</TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((project) => {
              const startDate = new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const endDate = new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const percentSpent = Math.min(100, Math.round((project.spent / project.budget) * 100));
              const spentColorClass = percentSpent > 90 ? "text-error" : "text-success";
              
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
                    {formatCurrency(project.budget)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${spentColorClass}`}>{formatCurrency(project.spent)}</span>
                        <span className="text-xs font-medium">{percentSpent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${percentSpent > 100 ? 'bg-error' : 'bg-success'} rounded-full`} 
                          style={{ width: `${Math.min(100, percentSpent)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClasses(project.status)}`}>
                      {project.status}
                    </span>
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
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <p className="text-xs mb-1">{startDate} - {endDate}</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressBarColor(project.status)} rounded-full`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-slate-500 hover:text-accent">
                      <i className="ri-more-2-fill"></i>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {paginatedProjects.length} of {filteredProjects.length} projects
        </p>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              className={`px-3 py-1 rounded-md ${
                currentPage === page 
                  ? 'bg-accent text-white' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectTable;
