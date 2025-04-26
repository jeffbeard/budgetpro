import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BudgetData } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BudgetChartProps {
  title?: string;
}

const BudgetChart = ({ title = "Budget Overview" }: BudgetChartProps) => {
  const { data, isLoading, error } = useQuery<BudgetData[]>({
    queryKey: ['/api/budget-data'],
  });

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
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
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-slate-800 mb-6">{title}</h3>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-red-500">Failed to load budget data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for Recharts
  const chartData = data.map(item => ({
    name: item.month,
    allocated: item.allocated,
    spent: item.spent
  }));

  return (
    <Card className="lg:col-span-2">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
              <span className="text-xs text-slate-500">Allocated</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary-200 mr-1"></div>
              <span className="text-xs text-slate-500">Spent</span>
            </div>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" fill="hsl(var(--accent))" />
              <Bar dataKey="spent" fill="hsl(var(--primary-200))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
