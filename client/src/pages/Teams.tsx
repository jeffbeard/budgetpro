import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useState } from "react";

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Filter users based on search query
  const filteredUsers = users ? users.filter(user => 
    searchQuery === '' || 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  return (
    <>
      {/* Teams Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team Members</h1>
          <p className="text-slate-500">Manage your team and assign members to projects</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-primary-900 text-white rounded-md text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2">
            <i className="ri-user-add-line mr-1"></i> Add Team Member
          </button>
        </div>
      </div>
      
      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:w-72">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search team members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select 
                  className="pl-4 pr-8 py-2 rounded-md border border-slate-200 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-full"
                >
                  <option>All Departments</option>
                  <option>Development</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Operations</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              </div>
              
              <button className="p-2 rounded-md border border-slate-200 hover:bg-slate-50">
                <i className="ri-filter-3-line"></i>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Team Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-slate-500">No team members found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary-900 flex items-center justify-center text-white text-xl font-medium">
                      {user.initials}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-slate-500">{user.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="text-xs text-accent hover:underline">View Projects</button>
                        <span className="text-xs text-slate-300">|</span>
                        <button className="text-xs text-accent hover:underline">Edit</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">Current Projects</span>
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Resource Allocation</span>
                      <span className="text-xs font-medium">75%</span>
                    </div>
                  </div>
                  
                  <div className="flex mt-4 gap-2">
                    <button className="flex-1 py-1.5 text-center text-xs border border-slate-200 rounded-md hover:bg-slate-50">
                      <i className="ri-message-line mr-1"></i> Message
                    </button>
                    <button className="flex-1 py-1.5 text-center text-xs text-white bg-accent rounded-md hover:bg-accent/90">
                      <i className="ri-add-line mr-1"></i> Assign
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Teams;
