import { useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      e.preventDefault();
      // Update URL without causing a page reload
      window.history.pushState({}, '', href);
      // Manually trigger a popstate event to let wouter know about the URL change
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <aside 
      className={`w-64 h-full bg-white border-r border-slate-200 fixed top-0 left-0 z-30 
                  overflow-y-auto transition-all duration-300 transform 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-md bg-primary-900 flex items-center justify-center">
            <i className="ri-bar-chart-line text-white"></i>
          </div>
          <h1 className="text-xl font-bold text-primary-900">BudgetPro</h1>
        </div>
        
        <nav className="space-y-1">
          <p className="text-xs uppercase text-slate-500 font-semibold mb-2 ml-4">Main</p>
          
          <a href="/" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${isActive("/") 
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-dashboard-line ${isActive("/") ? "text-accent" : ""}`}></i>
            <span>Dashboard</span>
          </a>
          
          <a href="/projects" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${isActive("/projects") 
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-file-list-3-line ${isActive("/projects") ? "text-accent" : ""}`}></i>
            <span>Projects</span>
          </a>
          
          <a href="/teams" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${isActive("/teams") 
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-team-line ${isActive("/teams") ? "text-accent" : ""}`}></i>
            <span>Teams</span>
          </a>
          
          <a href="/budgets" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${isActive("/budgets") 
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-money-dollar-circle-line ${isActive("/budgets") ? "text-accent" : ""}`}></i>
            <span>Budgets</span>
          </a>
          
          <a href="/resources" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${isActive("/resources") 
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-resource-line ${isActive("/resources") ? "text-accent" : ""}`}></i>
            <span>Resources</span>
          </a>
          
          {/* Admin Section */}
          <p className="text-xs uppercase text-slate-500 font-semibold mb-2 ml-4 mt-6">Admin</p>
          
          <a href="/admin?tab=projects" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'projects'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-folder-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'projects' ? "text-accent" : ""}`}></i>
            <span>Projects</span>
          </a>
          
          <a href="/admin?tab=users" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'users'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-user-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'users' ? "text-accent" : ""}`}></i>
            <span>Users</span>
          </a>
          
          <a href="/admin?tab=team" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'team'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-team-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'team' ? "text-accent" : ""}`}></i>
            <span>Team Members</span>
          </a>
          
          <a href="/admin?tab=deadlines" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'deadlines'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-calendar-event-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'deadlines' ? "text-accent" : ""}`}></i>
            <span>Deadlines</span>
          </a>
          
          <a href="/admin?tab=resources" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'resources'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-resource-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'resources' ? "text-accent" : ""}`}></i>
            <span>Resources</span>
          </a>
          
          <a href="/admin?tab=budget" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'budget'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-money-dollar-circle-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'budget' ? "text-accent" : ""}`}></i>
            <span>Budget Data</span>
          </a>
          
          <a href="/admin?tab=activities" 
             onClick={handleClick}
             className={`flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium 
                        ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'activities'
                          ? "bg-primary-100 text-primary-900" 
                          : "text-slate-600 hover:bg-slate-100"}`}>
            <i className={`ri-history-line ${location.startsWith("/admin") && new URLSearchParams(window.location.search).get('tab') === 'activities' ? "text-accent" : ""}`}></i>
            <span>Activities</span>
          </a>
          
          <p className="text-xs uppercase text-slate-500 font-semibold mb-2 ml-4 mt-6">Reports</p>
          
          <a href="#" className="flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
            <i className="ri-pie-chart-line"></i>
            <span>Analytics</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
            <i className="ri-file-chart-line"></i>
            <span>Reports</span>
          </a>
          
          <p className="text-xs uppercase text-slate-500 font-semibold mb-2 ml-4 mt-6">Settings</p>
          
          <a href="#" className="flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
            <i className="ri-user-settings-line"></i>
            <span>Account</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 py-2 px-4 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
            <i className="ri-settings-4-line"></i>
            <span>Settings</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
