import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    label: string;
    positive?: boolean;
  };
  icon: {
    name: string;
    background: string;
    color: string;
  };
}

const KpiCard = ({ title, value, change, icon }: KpiCardProps) => {
  const isPositiveChange = change?.positive !== undefined ? change.positive : true;
  const changeColorClass = isPositiveChange ? "text-success" : "text-error";
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={cn("p-2 rounded-md", icon.background, icon.color)}>
          <i className={icon.name}></i>
        </div>
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      {change && (
        <div className="flex items-center mt-2">
          <span className={cn("text-xs font-medium mr-1", changeColorClass)}>{change.value}</span>
          <span className="text-xs text-slate-500">{change.label}</span>
        </div>
      )}
    </Card>
  );
};

export default KpiCard;
