import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ResourceAlloc } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ResourceAllocationProps {
  title?: string;
}

const ResourceAllocation = ({ title = "Resource Allocation" }: ResourceAllocationProps) => {
  const { data, isLoading, error } = useQuery<ResourceAlloc[]>({
    queryKey: ['/api/resource-allocations'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-[300px] bg-slate-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-slate-800 mb-6">{title}</h3>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-red-500">Failed to load resource allocation data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average allocation
  const avgAllocation = data.reduce((acc, curr) => acc + curr.allocation, 0) / data.length;

  // Prepare data for pie chart
  const pieData = data.map(item => ({
    name: item.department,
    value: item.allocation,
    color: item.color.replace('bg-', '')
  }));

  // Map color classes to actual color values for Recharts
  const colorMap: Record<string, string> = {
    'success': '#10b981',   // green-500
    'accent': '#2563eb',    // blue-600
    'indigo-500': '#6366f1',
    'warning': '#f59e0b',   // amber-500
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button className="text-sm text-accent hover:underline">View all</button>
        </div>
        
        <div className="flex flex-col justify-center items-center">
          <div className="relative h-[120px] w-[120px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorMap[entry.color] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold">{avgAllocation.toFixed(0)}%</span>
              <span className="text-xs text-slate-500">allocated</span>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{item.department}</span>
                  <span className="text-xs font-medium">{item.allocation}%</span>
                </div>
                <Progress value={item.allocation} className={`h-2 ${item.color}`} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceAllocation;
