import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import UserForm from './forms/UserForm';

const UsersAdmin = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['/api/users'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading users: {error.message}</div>;
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'title', label: 'Title' },
    { 
      key: 'initials', 
      label: 'Initials',
      render: (user: any) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
          {user.initials || user.name?.charAt(0) || '?'}
        </div>
      )
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      title="Users"
      apiEndpoint="/api/users"
      queryKey={['/api/users']}
      formComponent={UserForm}
    />
  );
};

export default UsersAdmin;