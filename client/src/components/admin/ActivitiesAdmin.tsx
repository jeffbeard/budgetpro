import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import ActivityForm from './forms/ActivityForm';
import { format } from 'date-fns';

const ActivitiesAdmin = () => {
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading activities...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading activities: {error.message}</div>;
  }

  const columns = [
    { 
      key: 'type', 
      label: 'Type',
      render: (activity: any) => {
        const typeDisplay: Record<string, string> = {
          'upload': 'Upload',
          'comment': 'Comment',
          'add_member': 'Add Member',
          'update_budget': 'Budget Update',
        };
        
        return <div>{typeDisplay[activity.type] || activity.type}</div>;
      }
    },
    { 
      key: 'user', 
      label: 'User',
      render: (activity: any) => (
        <div>{activity.user?.name || `User ${activity.userId}`}</div>
      )
    },
    { 
      key: 'project', 
      label: 'Project',
      render: (activity: any) => (
        <div>
          {activity.project?.name || (activity.projectId ? `Project ${activity.projectId}` : 'N/A')}
        </div>
      )
    },
    { key: 'content', label: 'Content' },
    { 
      key: 'timestamp', 
      label: 'Timestamp',
      render: (activity: any) => (
        <div>{format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}</div>
      )
    },
  ];

  return (
    <DataTable
      data={activities}
      columns={columns}
      title="Activities"
      apiEndpoint="/api/activities"
      queryKey={['/api/activities']}
      formComponent={(props) => (
        <ActivityForm 
          {...props}
          projects={projects}
          users={users}
        />
      )}
    />
  );
};

export default ActivitiesAdmin;