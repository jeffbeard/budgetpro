import { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-slate-100">
          <i className="ri-menu-2-line"></i>
        </button>
        
        <div className="relative w-64">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-slate-100">
          <i className="ri-notification-3-line"></i>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"></span>
        </button>
        
        <button className="relative p-2 rounded-md hover:bg-slate-100">
          <i className="ri-message-3-line"></i>
        </button>
        
        <div className="flex items-center gap-3 ml-4">
          <div className="h-8 w-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-500">CEO</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
