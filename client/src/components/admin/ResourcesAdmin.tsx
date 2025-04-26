import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import ResourceForm from './forms/ResourceForm';
import { ResourceAlloc } from '@shared/schema';

const ResourcesAdmin = () => {
  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['/api/resource-allocations'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading resources: {error.message}</div>;
  }

  const columns = [
    { key: 'department', label: 'Department' },
    { 
      key: 'allocation', 
      label: 'Allocation (%)',
      render: (resource: ResourceAlloc) => (
        <div>{resource.allocation}%</div>
      )
    },
    { 
      key: 'color', 
      label: 'Color',
      render: (resource: ResourceAlloc) => (
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${resource.color}`}></div>
          <span>{resource.color}</span>
        </div>
      )
    },
  ];

  return (
    <DataTable
      data={resources}
      columns={columns}
      title="Resource Allocations"
      apiEndpoint="/api/resource-allocations"
      queryKey={['/api/resource-allocations']}
      formComponent={ResourceForm}
    />
  );
};

export default ResourcesAdmin;