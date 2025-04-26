import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import ProjectForm from './forms/ProjectForm';
import { format } from 'date-fns';
import { Project } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

const ProjectsAdmin = () => {
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading projects: {error.message}</div>;
  }

  const statusColors: Record<string, string> = {
    'on track': 'bg-green-100 text-green-800',
    'at risk': 'bg-yellow-100 text-yellow-800',
    'over budget': 'bg-red-100 text-red-800',
    'completed': 'bg-blue-100 text-blue-800',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (project: Project) => (
        <div className="capitalize">{project.category}</div>
      )
    },
    { 
      key: 'budget', 
      label: 'Budget',
      render: (project: Project) => (
        <div>{formatCurrency(project.budget)}</div>
      )
    },
    { 
      key: 'spent', 
      label: 'Spent',
      render: (project: Project) => (
        <div>{formatCurrency(project.spent)}</div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (project: Project) => {
        return (
          <Badge className={statusColors[project.status] || 'bg-gray-100'}>
            {project.status}
          </Badge>
        );
      }
    },
    { 
      key: 'progress', 
      label: 'Progress',
      render: (project: Project) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${project.progress}%` }}>
          </div>
        </div>
      )
    },
    { 
      key: 'dates', 
      label: 'Timeline',
      render: (project: Project) => (
        <div className="text-xs">
          {format(new Date(project.startDate), 'MMM d, yyyy')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
        </div>
      )
    },
  ];

  return (
    <DataTable
      data={projects}
      columns={columns}
      title="Projects"
      apiEndpoint="/api/projects"
      queryKey={['/api/projects']}
      formComponent={ProjectForm}
    />
  );
};

export default ProjectsAdmin;