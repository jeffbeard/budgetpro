import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User, Project } from "@shared/schema";

interface EnhancedActivity {
  id: number;
  userId: number;
  projectId: number | null;
  type: string;
  content: string;
  timestamp: string;
  user: User | null;
  project: Project | null;
}

const TeamActivity = () => {
  const { data, isLoading } = useQuery<EnhancedActivity[]>({
    queryKey: ['/api/activities'],
  });
  
  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Team Activity</h3>
            <button className="text-sm text-accent hover:underline">View all</button>
          </div>
          <p className="text-slate-500">No recent activities found.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Function to format time differences
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    }
    if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    }
    if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">Team Activity</h3>
          <button className="text-sm text-accent hover:underline">View all</button>
        </div>
        
        <div className="space-y-4">
          {data.map((activity) => {
            if (!activity.user) return null;
            
            // Customize content based on activity type
            let content;
            let actions;
            
            switch (activity.type) {
              case 'upload':
                content = (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-xs text-slate-500">uploaded a file to</span>
                    <span className="font-medium text-sm">{activity.project?.name || 'a project'}</span>
                  </div>
                );
                actions = (
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-accent hover:underline">View File</button>
                    <span className="text-xs text-slate-400">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                );
                break;
                
              case 'comment':
                content = (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-xs text-slate-500">commented on</span>
                    <span className="font-medium text-sm">{activity.project?.name || 'a project'}</span>
                  </div>
                );
                actions = (
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-accent hover:underline">Reply</button>
                    <span className="text-xs text-slate-400">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                );
                break;
                
              case 'add_member':
                content = (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-xs text-slate-500">added team members to</span>
                    <span className="font-medium text-sm">{activity.project?.name || 'a project'}</span>
                  </div>
                );
                actions = (
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-accent hover:underline">View Team</button>
                    <span className="text-xs text-slate-400">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                );
                break;
                
              case 'update_budget':
                content = (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-xs text-slate-500">updated budget for</span>
                    <span className="font-medium text-sm">{activity.project?.name || 'a project'}</span>
                  </div>
                );
                actions = (
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-accent hover:underline">View Changes</button>
                    <span className="text-xs text-slate-400">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                );
                break;
                
              default:
                content = (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-xs text-slate-500">performed an action</span>
                  </div>
                );
                actions = (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                );
            }
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div 
                  className="h-8 w-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                  title={activity.user.name}
                >
                  {activity.user.initials}
                </div>
                <div>
                  {content}
                  <p className="text-xs text-slate-500 mt-1">{activity.content}</p>
                  {actions}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivity;
