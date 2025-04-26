import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Project } from "@shared/schema";

interface EnhancedDeadline {
  id: number;
  title: string;
  projectId: number | null;
  category: string | null;
  date: string;
  priority: string;
  project: Project | null;
}

const UpcomingDeadlines = () => {
  const { data, isLoading } = useQuery<EnhancedDeadline[]>({
    queryKey: ['/api/deadlines'],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 bg-slate-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Upcoming Deadlines</h3>
            <button className="text-sm text-accent hover:underline">View calendar</button>
          </div>
          <p className="text-slate-500">No upcoming deadlines.</p>
          
          <button className="w-full mt-4 py-2 text-center text-sm text-accent border border-dashed border-accent rounded-md hover:bg-blue-50">
            + Add Deadline
          </button>
        </CardContent>
      </Card>
    );
  }
  
  // Get label based on priority
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { text: 'Urgent', classes: 'bg-red-100 text-red-800' };
      case 'this_week':
        return { text: 'This Week', classes: 'bg-yellow-100 text-yellow-800' };
      case 'next_week':
        return { text: 'Next Week', classes: 'bg-green-100 text-green-800' };
      case 'upcoming':
        return { text: 'Upcoming', classes: 'bg-blue-100 text-blue-800' };
      default:
        return { text: 'Scheduled', classes: 'bg-slate-100 text-slate-800' };
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    // Check if the date is today or tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      // Otherwise format as MMM D
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">Upcoming Deadlines</h3>
          <button className="text-sm text-accent hover:underline">View calendar</button>
        </div>
        
        <div className="space-y-4">
          {data.map((deadline) => {
            const priority = getPriorityLabel(deadline.priority);
            const formattedDate = formatDate(deadline.date);
            
            return (
              <div key={deadline.id} className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{deadline.title}</span>
                  <span className={`text-xs ${priority.classes} px-2 py-0.5 rounded-full`}>
                    {priority.text}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  {deadline.project?.name || 'All Projects'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-500">
                    <i className="ri-calendar-line mr-1"></i>
                    <span>{formattedDate}</span>
                  </div>
                  {deadline.project && (
                    <div className="flex -space-x-2">
                      <div
                        className="h-6 w-6 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs"
                        title="Team Member"
                      >
                        SM
                      </div>
                      <div
                        className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs"
                        title="Team Member"
                      >
                        JW
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          <button className="w-full py-2 text-center text-sm text-accent border border-dashed border-accent rounded-md hover:bg-blue-50">
            + Add Deadline
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
