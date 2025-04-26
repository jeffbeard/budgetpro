import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import TeamMemberForm from './forms/TeamMemberForm';

interface EnhancedTeamMember {
  id: number;
  projectId: number;
  userId: number;
  user?: {
    id: number;
    name: string;
    title?: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

const TeamMembersAdmin = () => {
  const { data: teamMembers = [], isLoading, error } = useQuery({
    queryKey: ['/api/team-members'],
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
    return <div className="flex justify-center p-8">Loading team members...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading team members: {error.message}</div>;
  }

  const columns = [
    { 
      key: 'user', 
      label: 'Team Member',
      render: (teamMember: EnhancedTeamMember) => (
        <div className="font-medium">
          {teamMember.user?.name || `User ${teamMember.userId}`}
        </div>
      )
    },
    { 
      key: 'userTitle',
      label: 'Title',
      render: (teamMember: EnhancedTeamMember) => (
        <div>{teamMember.user?.title || 'N/A'}</div>
      )
    },
    { 
      key: 'project', 
      label: 'Project',
      render: (teamMember: EnhancedTeamMember) => (
        <div>
          {teamMember.project?.name || `Project ${teamMember.projectId}`}
        </div>
      )
    },
  ];

  return (
    <DataTable
      data={teamMembers}
      columns={columns}
      title="Team Members"
      apiEndpoint="/api/team-members"
      queryKey={['/api/team-members']}
      formComponent={(props) => (
        <TeamMemberForm
          {...props}
          projects={projects}
          users={users}
        />
      )}
    />
  );
};

export default TeamMembersAdmin;