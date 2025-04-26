import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import DataTable from './DataTable';
import BudgetDataForm from './forms/BudgetDataForm';
import { BudgetData } from '@shared/schema';

const BudgetDataAdmin = () => {
  const { data: budgetData = [], isLoading, error } = useQuery({
    queryKey: ['/api/budget-data'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading budget data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading budget data: {error.message}</div>;
  }

  const columns = [
    { key: 'month', label: 'Month' },
    { 
      key: 'allocated', 
      label: 'Allocated',
      render: (data: BudgetData) => (
        <div>${data.allocated.toLocaleString()}</div>
      )
    },
    { 
      key: 'spent', 
      label: 'Spent',
      render: (data: BudgetData) => (
        <div>${data.spent.toLocaleString()}</div>
      )
    },
    {
      key: 'variance',
      label: 'Variance',
      render: (data: BudgetData) => {
        const variance = data.spent - data.allocated;
        const isOverBudget = variance > 0;
        
        return (
          <div className={`${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {isOverBudget ? '+' : ''}{variance.toLocaleString()}
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      data={budgetData}
      columns={columns}
      title="Budget Data"
      apiEndpoint="/api/budget-data"
      queryKey={['/api/budget-data']}
      formComponent={BudgetDataForm}
    />
  );
};

export default BudgetDataAdmin;