import { useQuery } from '@tanstack/react-query';
import KpiCard from '@/components/dashboard/KpiCard';
import BudgetChart from '@/components/dashboard/BudgetChart';
import ResourceAllocation from '@/components/dashboard/ResourceAllocation';
import ProjectTable from '@/components/dashboard/ProjectTable';
import TeamActivity from '@/components/dashboard/TeamActivity';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { useState } from 'react';

interface DashboardStats {
  totalBudget: number;
  totalProjects: number;
  activeProjects: number;
  budgetVariance: string;
  resourceUtilization: string;
}

interface DashboardData {
  stats: DashboardStats;
  budgetData: any[];
  resourceAllocations: any[];
  recentActivities: any[];
  upcomingDeadlines: any[];
}

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
          <p className="text-slate-500">Track budgets, resources, and project progress</p>
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
          
          <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
            <i className="ri-download-line mr-1"></i> Export
          </button>
          
          <button className="px-4 py-2 bg-primary-900 text-white rounded-md text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2">
            <i className="ri-add-line mr-1"></i> New Project
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard 
          title="Total Budget"
          value={isLoading ? "Loading..." : formatCurrency(data?.stats.totalBudget || 0)}
          change={{ value: "+5.2%", label: "from previous period", positive: true }}
          icon={{
            name: "ri-money-dollar-circle-line",
            background: "bg-blue-50",
            color: "text-accent"
          }}
        />
        
        <KpiCard 
          title="Allocated Resources"
          value={isLoading ? "Loading..." : `${data?.stats.resourceUtilization || 0}%`}
          change={{ value: data?.stats.resourceUtilization + "%", label: "resource utilization" }}
          icon={{
            name: "ri-team-line",
            background: "bg-green-50",
            color: "text-success"
          }}
        />
        
        <KpiCard 
          title="Active Projects"
          value={isLoading ? "Loading..." : data?.stats.activeProjects || 0}
          change={{ value: "+2", label: "from previous period", positive: true }}
          icon={{
            name: "ri-folder-line",
            background: "bg-indigo-50",
            color: "text-indigo-500"
          }}
        />
        
        <KpiCard 
          title="Budget Variance"
          value={isLoading ? "Loading..." : data?.stats.budgetVariance + "%"}
          change={{ 
            value: parseFloat(data?.stats.budgetVariance || "0") < 0 ? "Under budget" : "Over budget", 
            label: "across all projects",
            positive: parseFloat(data?.stats.budgetVariance || "0") < 0
          }}
          icon={{
            name: "ri-bar-chart-line",
            background: "bg-orange-50",
            color: "text-warning"
          }}
        />
      </div>
      
      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <BudgetChart />
        <ResourceAllocation />
      </div>
      
      {/* Project Table */}
      <ProjectTable />
      
      {/* Collaboration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TeamActivity />
        <UpcomingDeadlines />
      </div>
    </>
  );
};

export default Dashboard;
