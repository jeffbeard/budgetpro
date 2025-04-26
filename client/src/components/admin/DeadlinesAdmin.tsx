import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import DeadlineForm from './forms/DeadlineForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Deadline } from '@shared/schema';

const DeadlinesAdmin = () => {
  const { data: deadlines = [], isLoading, error } = useQuery({
    queryKey: ['/api/deadlines'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading deadlines...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading deadlines: {error.message}</div>;
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'project', 
      label: 'Project',
      render: (deadline: any) => (
        <div>
          {deadline.project?.name || (deadline.projectId ? `Project ${deadline.projectId}` : 'All Projects')}
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { 
      key: 'date', 
      label: 'Deadline Date',
      render: (deadline: any) => (
        <div>{format(new Date(deadline.date), 'MMM d, yyyy')}</div>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (deadline: any) => {
        const priorityColors: Record<string, string> = {
          'urgent': 'bg-red-100 text-red-800',
          'this_week': 'bg-orange-100 text-orange-800',
          'next_week': 'bg-yellow-100 text-yellow-800',
          'upcoming': 'bg-blue-100 text-blue-800',
        };
        
        const priorityDisplay: Record<string, string> = {
          'urgent': 'Urgent',
          'this_week': 'This Week',
          'next_week': 'Next Week',
          'upcoming': 'Upcoming',
        };
        
        return (
          <Badge className={priorityColors[deadline.priority] || 'bg-gray-100'}>
            {priorityDisplay[deadline.priority] || deadline.priority}
          </Badge>
        );
      }
    },
  ];

  return (
    <DataTable
      data={deadlines}
      columns={columns}
      title="Deadlines"
      apiEndpoint="/api/deadlines"
      queryKey={['/api/deadlines']}
      formComponent={(props) => (
        <DeadlineForm {...props} projects={projects} />
      )}
    />
  );
};

export default DeadlinesAdmin;